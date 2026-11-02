import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './supabase.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  providers: [SupabaseService],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  
  
}
