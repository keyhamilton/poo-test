import { Canal } from "./canal";
import { Playlist } from "./playlist";
import { Video } from './video'

let canal: Canal = new Canal(1, 'canal 1');
let video: Video = new Video(1, 'primeiro video', 5);
let v2: Video = new Video(2, 'segundo video', 5);
let v3: Video = new Video(3, 'terceiro video', 5);
let playlist: Playlist = new Playlist(1, 'primeira playlist', 1);
//playlist.adicionar(video);
//canal.adicionar(video);
//canal.adicionar(v2);
//canal.adicionar(v3);

//canal.excluir('2');

//canal.pesquisar('1');
playlist.reproduzir();
