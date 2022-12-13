import * as fs from 'node:fs'
import { Canal } from './canal'
import prompt from "prompt-sync";
import { Playlist } from './playlist';
import { Video } from './video';
import { OpcaoInvalidaError, PlaylistJaExistError, PlaylistNaoExistError } from './excecoes';


const input = prompt();
let opcao: string = '';
let canal: Canal = new Canal(1, 'meu canal');
canal.init()

async function main(): Promise<void> {
    do {
        console.log('\nBem vindo\nDigite uma opção:\n');
        console.log('1 - Reproduzir video  2 - Criar Video   3 - Criar playlist\n' +
                    '4 - Adicionar a playlist  5 - Excluir video do canal    6 - Reproduzir playlist\n' +
                    '7 – Excluir da playlist                8 - Listar videos\n' + 
                    '0 - Sair\n');
        opcao = input("Opção:");
        try {
            validarOpcao(opcao);
            switch (opcao) {
                case "1":
                    await reproduzirVideo();
                    break;
                case "2":
                    adicionarNoCanal();
                    break;
                case "3":
                    criarPlaylist();
                    break;
                case "4":
                    adicionarNaPlaylist();
                    break;
                case "5":
                    excluirDoCanal();
                    break;
                case "6":
                    await reproduzirPlaylist();
                    break;
                case "7":
                    excluirDaPlaylist();
                    break;
                case "8":
                    listarVideos();
                
            }
            if(opcao != '0') {
                input("Operação finalizada. Digite <enter>");         
            };
        } catch (e: any) {
            console.log('\nERRO: '+e.message);
        }
        
    } while (opcao != '0');
    
}

//auxiliar
function consultarPlaylist(id: string): boolean {
    let p = false;
    let playlists: string = fs.readFileSync('playlists.txt', 'utf-8')
    let array = playlists.split('\n')
    for(let playlist of array){
        if(playlist[0] == id){
            p = true;
        }
    }
    return p;
}

function criarPlaylist() {
    let id: number = parseInt(input('id da playlist: '));
    if(consultarPlaylist(id.toString())){
        throw new PlaylistJaExistError('Playlist já existe');
    }
    let nome: string = input("Nome da playlist: ");
    let canalId: number = canal.id;

    let playlist: Playlist = new Playlist(id, nome, canalId);
    canal.criarPlaylist(playlist);
}
//auxiliar
function criarVideo() {
    let id: number = parseInt(input('id do video: '));
    let titulo: string = input('Titulo: ');
    let duracao: number = parseInt(input('Duração: '));

    let video: Video = new Video(id, titulo, duracao)
    return video;
}
// usar em main
function adicionarNoCanal(){
    let video = criarVideo()
    canal.adicionar(video)
}

function excluirDoCanal(){
    let id = input("id do video: ");
    canal.excluir(id);
}

function adicionarNaPlaylist(){
    let id: number = parseInt(input('id da playlist: '));
    if(!consultarPlaylist(id.toString())){
        throw new PlaylistNaoExistError('Playlist não existe');
    }
    let p = buscarPlaylist(id.toString());
    let array = p.split(':');
    let playlist: Playlist = new Playlist(id, array[1], canal.id)
    let v = input("id do video: ");
    let video: string = canal.pesquisar(v);
    let arr = video.split(':');
    let vid: Video = new Video(parseInt(arr[0]), arr[1], parseInt(arr[2]))
    playlist.adicionar(vid);

}
// auxiliar
function buscarPlaylist(id: string){
    if(!consultarPlaylist(id)){
        throw new PlaylistNaoExistError('Playlist não existe');
    }
    let p: string = '';
    let playlists: string = fs.readFileSync('playlists.txt', 'utf-8')
    let array = playlists.split('\n')
    for(let playlist of array){
        if(playlist[0] == id){
            p += playlist;
        }
    }
    return p;
}
//usar em main
async function reproduzirVideo(){
    let id: string = input('id do video: ');
    let video: string = canal.pesquisar(id);
    let array = video.split(':');
    let vid: Video = new Video(parseInt(array[0]), array[1], parseInt(array[2]));
    await vid.reproduzir();
}

async function reproduzirPlaylist() {
    let id = input('id da playlist: ');
    let playlist = buscarPlaylist(id);
    let array = playlist.split(':');
    let plst: Playlist = new Playlist(parseInt(array[0]), array[1], canal.id);
    await plst.reproduzir();
}

function excluirDaPlaylist(){
    let id = input('id da playlist: ');
    let playlist = buscarPlaylist(id);
    let array = playlist.split(':');
    let plst: Playlist = new Playlist(parseInt(array[0]), array[1], canal.id);
    let idVideo = input('id do video: ');
    plst.excluir(idVideo);
}

function listarVideos(){
    let videos = canal.carregar()
    let array = videos.split('\n');
    array.pop();
    for(let video of array){
        let arr = video.split(':');
        console.log('id: '+arr[0]+' '+'titulo: '+arr[1]);
    }
}

function validarOpcao(opcao: string){
    if(!Number(opcao) && opcao != '0'){
        throw new OpcaoInvalidaError('Opção inválida.');
    }

    let op = parseInt(opcao)

    if(op < 0 || op > 8){
        throw new OpcaoInvalidaError('Opção inválida.');
    }
}

main();