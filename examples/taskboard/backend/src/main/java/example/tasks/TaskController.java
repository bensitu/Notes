package example.tasks;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.net.URI;
import java.util.List;
import org.springframework.http.*;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final JdbcClient jdbc;

    public TaskController(JdbcClient jdbc) { this.jdbc = jdbc; }

    public record Task(long id, String title, boolean done, long version) {}
    public record CreateTask(@NotBlank @Size(max = 100) String title) {}
    public record UpdateTask(
            @NotBlank @Size(max = 100) String title,
            @NotNull Boolean done,
            @NotNull @PositiveOrZero Long version) {}

    @GetMapping
    public List<Task> list() {
        return jdbc.sql("SELECT id, title, done, version FROM task ORDER BY id DESC LIMIT 100")
                .query(Task.class).list();
    }

    @GetMapping("/{id}")
    public Task get(@PathVariable long id) {
        return jdbc.sql("SELECT id, title, done, version FROM task WHERE id = :id")
                .param("id", id).query(Task.class).optional()
                .orElseThrow(() -> new TaskError(HttpStatus.NOT_FOUND, "Task was not found"));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Task> create(@Valid @RequestBody CreateTask input) {
        var keys = new org.springframework.jdbc.support.GeneratedKeyHolder();
        jdbc.sql("INSERT INTO task (title) VALUES (:title)")
                .param("title", input.title().strip()).update(keys, "id");
        Number key = keys.getKey();
        if (key == null) throw new IllegalStateException("Generated key is missing");
        Task task = get(key.longValue());
        return ResponseEntity.created(URI.create("/api/tasks/" + task.id())).body(task);
    }

    @PutMapping("/{id}")
    @Transactional
    public Task update(@PathVariable long id, @Valid @RequestBody UpdateTask input) {
        int rows = jdbc.sql("""
                UPDATE task SET title = :title, done = :done, version = version + 1
                WHERE id = :id AND version = :version
                """).param("title", input.title().strip()).param("done", input.done())
                .param("id", id).param("version", input.version()).update();
        if (rows == 0) {
            get(id);
            throw new TaskError(HttpStatus.CONFLICT, "Task changed; reload and try again");
        }
        return get(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        int rows = jdbc.sql("DELETE FROM task WHERE id = :id").param("id", id).update();
        if (rows == 0) throw new TaskError(HttpStatus.NOT_FOUND, "Task was not found");
        return ResponseEntity.noContent().build();
    }
}

class TaskError extends RuntimeException {
    final HttpStatus status;
    TaskError(HttpStatus status, String message) { super(message); this.status = status; }
}

@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(TaskError.class)
    ProblemDetail taskError(TaskError error) {
        return ProblemDetail.forStatusAndDetail(error.status, error.getMessage());
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    ProblemDetail invalidInput() {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Check the input fields");
    }
}
