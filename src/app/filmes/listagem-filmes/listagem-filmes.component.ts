import { Component, OnInit } from '@angular/core';
import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigParams } from 'src/app/shared/models/config-params';
import { Router } from '@angular/router';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {

  readonly semFoto = 'https://www.termoparts.com.br/wp-content/uploads/2017/10/no-image.jpg';
  config: ConfigParams = {
    pagina: 0,
    limite: 4,
  };
  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;

  constructor(private filmesService: FilmesService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.filtrosListagem = this.fb.group({
      texto: [''],
      genero: ['']
    });

    this.generos = ['Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção científica', 'Romance', 'Terror'];
    this.pesquisa();
    this.listarFilmes();
  }

  listarFilmes(): void {
    this.config.pagina++;
    this.filmesService.listar(this.config).subscribe({
      next: filmes => {
        this.filmes.push(...filmes);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onScroll(): void {
    this.listarFilmes();
  }

  pesquisa() {
    this.filtrosListagem.get('texto').valueChanges
    .pipe(debounceTime(500))
    .subscribe((val: string) => {
      this.config.pesquisa = val;
      this.resetarConsulta();
    });

    this.filtrosListagem.get('genero').valueChanges
    .pipe(debounceTime(500))
    .subscribe((val: string) => {
      this.config.campo = {tipo: 'genero', valor: val};
      this.resetarConsulta();
    });
  }

  abrir(id: number) {
    this.router.navigateByUrl('/filmes/' + id);
  }

  private resetarConsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }
}
