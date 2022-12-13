import { Video } from "./video";

import * as fs from 'node:fs'
import { CarregamentoDeVideosError, VideoJaExisteError, VideoNaoEncontradoError } from "./excecoes";
import { Playlist } from "./playlist";
import { openSync } from "node:fs";

class Canal {
    private _id: number;
    private _nome: string;
    
    constructor(id: number, nome: string) {
        this._nome = nome;
        this._id = id;
    }
    

    get nome(): string {
        return this._nome;
    }

    get id(): number{
        return this._id;
    }

    init(): void {
        try{
            this.carregar()
        } catch {

            let fd = fs.openSync(`canal${this._id}_videos.txt`, 'w');
            fs.closeSync(fd);
        }

        try{
            fs.readFileSync('playlists.txt', 'utf-8');
        }catch {
            let fd = fs.openSync('playlists.txt', 'w');
            fs.closeSync(fd);
        }
    }


    pesquisar(id: string): string {
        let s = '';
        let videos = this.carregar();
        let array = videos.split('\n');
        for(let video of array){
            if(video[0] == id){
                s = video
            }
        }
        if(s == ''){
            throw new VideoNaoEncontradoError("Vídeo não encontrado");
        }
        return s;
    }

    carregar(): string {
        try {
            let videos = fs.readFileSync(`canal${this._id}_videos.txt`, 'utf-8');
            return videos;
        }catch {
            throw new CarregamentoDeVideosError("Erro no carregamento de vídeos")
        }
    }

    adicionar(video: Video) {
        try {
            let s = this.pesquisar(video.id.toString())
            throw new VideoJaExisteError('Vídeo já existe')
        } catch (e: any) {
            if(e instanceof VideoNaoEncontradoError){
                fs.appendFileSync(`canal${this._id}_videos.txt`, `${video.id}:${video.titulo}:${video.duracao}\n`);
            }else{
                console.log('\nERRO: '+e.message);
            }
            
        }
        
    }

    criarPlaylist(playlist: Playlist): void {
        
        fs.appendFileSync('playlists.txt', `${playlist.id}:${playlist.nome}\n`);
        
        let fd = fs.openSync(`canal${this._id}_playlist${playlist.id}_videos.txt`, 'w');
        fs.closeSync(fd);
    }

    excluir(id: string){
        this.pesquisar(id);
        let videos = this.carregar();
        let array = videos.split('\n');
        array.pop();
        let indice = '';
        for(let i = 0; i < array.length; i++){
            if(array[i][0] == id){
                indice = i.toString();
            }
        }
        let loco = parseInt(indice)
        for(let i = loco; i < array.length; i++){
            array[i] = array[i+1];
        }
        array.pop();
        let fd = fs.openSync(`canal${this._id}_videos.txt`, 'w');
        for(let video of array){
            fs.appendFileSync(fd, video+'\n');
        }
        fs.closeSync(fd);
    }

}

export { Canal };