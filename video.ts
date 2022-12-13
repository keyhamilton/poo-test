import * as fs from 'node:fs'
import { IReproduzivel } from './IReproduzivel';

class Video implements IReproduzivel {
    private _id: number;
    private _titulo: string;
    private _duracao: number;

    constructor(id: number, titulo: string, duracao: number) {
        this._id = id;
        this._titulo = titulo;
        this._duracao = duracao;

    }

    get id(): number {
        return this._id;
    }

    get titulo(): string {
        return this._titulo;
    }

    get duracao(): number {
        return this._duracao;
    }


    
    async reproduzir() {
        const sleep = (ms:number) => new Promise(r => setTimeout(r, ms));
        for(let i = 0; i < this._duracao; i++){
            console.clear();
            console.log(`Título: ${this._titulo}`)
            console.log(`reproduzindo: ${i+1}`);
            await sleep(1000);
            console.clear();
        }

    }
    
}

export { Video };