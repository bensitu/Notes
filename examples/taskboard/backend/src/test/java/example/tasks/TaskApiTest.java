package example.tasks;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TaskApiTest {
    @Autowired MockMvc mvc;

    @Test void anonymousCannotReadTasks() throws Exception {
        mvc.perform(get("/api/tasks")).andExpect(status().isUnauthorized());
    }

    @Test void mutationNeedsCsrf() throws Exception {
        mvc.perform(post("/api/tasks").with(user("admin").roles("ADMIN"))
                .contentType("application/json").content("{\"title\":\"Learn testing\"}"))
                .andExpect(status().isForbidden());
    }

    @Test void blankTitleIsRejected() throws Exception {
        mvc.perform(post("/api/tasks").with(user("admin").roles("ADMIN")).with(csrf())
                .contentType("application/json").content("{\"title\":\"  \"}"))
                .andExpect(status().isBadRequest());
    }

    @Test void taskLifecycleAndStaleWrite() throws Exception {
        String location = mvc.perform(post("/api/tasks")
                .with(user("admin").roles("ADMIN")).with(csrf())
                .contentType("application/json").content("{\"title\":\"Learn testing\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getHeader("Location");
        mvc.perform(put(location).with(user("admin").roles("ADMIN")).with(csrf())
                .contentType("application/json")
                .content("{\"title\":\"Done\",\"done\":true,\"version\":0}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.version").value(1));
        mvc.perform(put(location).with(user("admin").roles("ADMIN")).with(csrf())
                .contentType("application/json")
                .content("{\"title\":\"Stale\",\"done\":false,\"version\":0}"))
                .andExpect(status().isConflict());
        mvc.perform(delete(location).with(user("reader").roles("USER")).with(csrf()))
                .andExpect(status().isForbidden());
        mvc.perform(delete(location).with(user("admin").roles("ADMIN")).with(csrf()))
                .andExpect(status().isNoContent());
        mvc.perform(get(location).with(user("admin").roles("ADMIN")))
                .andExpect(status().isNotFound());
    }
}
