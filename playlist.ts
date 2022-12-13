import { Canal } from "./canal";
import { CanalNaoExisteError, CarregamentoDeVideosError, VideoJaExisteError, VideoNaoEncontradoError } from "./excecoes";
import { Video } from "./video";
import * as fs from 'node:fs'
import { IReproduzivel } from "./IReproduzivel";

class Playlist extends Canal implements IReproduzivel{
    private _canalId: number;
    constructor(id: number, nome: string, canalId: number){
        super(id, nome);
        this._canalId = canalId;
    }

    
    pesquisaInterna(id: string): boolean {
        let v = false;
        try {
            let videos = fs.readFileSync(`canal${this._canalId}_playlist${this.id}_videos.txt`, 'utf-8')
            let array = videos.split('\n');
            for(let video of array){
                if(video[0] == id){
                    v = true;
                }
            }
        } catch (error) {
            throw new CarregamentoDeVideosError("Erro no carregamento de vídeos");
        }
        return v;
    }

    adicionar(video: Video): void {
        let condicao = this.pesquisaInterna(video.id.toString());
        if(condicao){
            throw new VideoJaExisteError('Vídeo já existe na playlist');
        }
        try {
            let s = this.pesquisar(video.id.toString())
            fs.appendFileSync(`canal${this._canalId}_playlist${this.id}_videos.txt`, `${video.id}:${video.titulo}:${video.duracao}\n`);
        } catch (e: any) {
    
            console.log(e);
            
        }
    }

    carregar(): string {
        try {
            let videos = fs.readFileSync(`canal${this._canalId}_videos.txt`, 'utf-8');
            return videos;
        }catch {
            throw new CarregamentoDeVideosError("Erro no carregamento de vídeos")
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

    async reproduzir(): Promise<void> {
        let lista = []
        try {
            let videos = fs.readFileSync(`canal${this._canalId}_playlist${this.id}_videos.txt`, 'utf-8')
            let array = videos.split('\n');
            for(let video of array){
                let v = video.split(':');
                let vid: Video = new Video(parseInt(v[0]), v[1], parseInt(v[2]))
                lista.push(vid);
            }
        } catch (error) {
            throw new CarregamentoDeVideosError("Erro no carregamento de vídeos");
        }
        const play = async (lista: Video[]) => {

            for(let video of lista){
                await video.reproduzir();
            }
        }
        await play(lista);
    }

    excluir(id: string): void {
        if(!this.pesquisaInterna(id)){
            throw new VideoNaoEncontradoError('Video não está na playlist');
        }
        let backup: Video[] = [];
        let videos = fs.readFileSync(`canal${this._canalId}_playlist${this.id}_videos.txt`, 'utf-8')
        let array = videos.split('\n');
        for(let video of array){
            if(video[0] != id && video != ''){
                let arr = video.split(':');
                let v: Video = new Video(parseInt(arr[0]), arr[1], parseInt(arr[2]));
                backup.push(v);
            }
        }
        let fd = fs.openSync(`canal${this._canalId}_playlist${this.id}_videos.txt`, 'w')
        fs.closeSync(fd);
        for(let vid of backup){
            this.adicionar(vid);
        }
    }
}

export { Playlist };