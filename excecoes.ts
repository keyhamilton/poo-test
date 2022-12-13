class VideoNaoEncontradoError extends Error {
    constructor(message: string){
        super(message);
    }
}

class CarregamentoDeVideosError extends Error {
    constructor(message: string){
        super(message);
    }
}

class VideoJaExisteError extends Error {
    constructor(message: string){
        super(message);
    }
}

class CanalNaoExisteError extends Error {
    constructor(message: string){
        super(message);
    }
}

class PlaylistJaExistError extends Error {
    constructor(message: string){
        super(message);
    }
}

class PlaylistNaoExistError extends Error {
    constructor(message: string){
        super(message);
    }
}

class OpcaoInvalidaError extends Error {
    constructor(message: string){
        super(message);
    }
}

export { VideoNaoEncontradoError, CarregamentoDeVideosError, VideoJaExisteError, CanalNaoExisteError, PlaylistJaExistError, 
    PlaylistNaoExistError, OpcaoInvalidaError };