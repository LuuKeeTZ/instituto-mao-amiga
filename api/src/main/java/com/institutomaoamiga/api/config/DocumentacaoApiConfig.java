package com.institutomaoamiga.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DocumentacaoApiConfig {

    @Bean
    public OpenAPI documentacao() {
        return new OpenAPI().info(new Info()
                .title("API Instituto Mão Amiga")
                .version("v1")
                .description("Pontos de coleta/distribuição e doações do Instituto Mão Amiga (Goiânia)."));
    }
}
