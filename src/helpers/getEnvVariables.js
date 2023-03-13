export const getEnvVariables = () => {

    // import.meta.env

    return {
        // para producción
        VITE_API_URL: import.meta.env.VITE_API_URL
        // import.meta.env
    }
}
