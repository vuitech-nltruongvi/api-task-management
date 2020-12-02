export interface ServerConfig {
    port: string
    origin: string
}

export interface DbConfig {
    type: any
    host: string
    username: string
    password: string
    synchronize: boolean
    port: number
    database: string
}

export interface JwtConfig {
    expiresIn: string
    secret: string
}