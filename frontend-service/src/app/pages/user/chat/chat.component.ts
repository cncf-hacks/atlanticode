import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiProgressModule } from '@taiga-ui/kit';
import { Subscription } from 'rxjs';
import { SharedModule } from 'src/app/lib/components/shared-module';
import { ChatMessage } from 'src/app/lib/interfaces/chat.message';
import { AuthService } from 'src/app/services/auth.service';
import { ExecutorService } from 'src/app/services/executor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, RouterModule, SharedModule, TuiProgressModule, TuiButtonModule, TuiAvatarModule, ReactiveFormsModule, FormsModule,TuiSvgModule,]
})
export class ChatComponent {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  userName: string | null = '';
  profilePic = localStorage.getItem('picture')
  private subscription!: Subscription;
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService, private userService: UserService, private route: ActivatedRoute, private executorService: ExecutorService) { }

  sessionId: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('sessionId') || '';
    });

    this.subscription = this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        const user = this.userService.getUser();
        if (user && user.picture) {
          this.userName = user.name
        }
      }
    });

    this.authService.checkLoginStatus().subscribe()

    this.messages = [];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  addMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({ role: 'user', content: this.newMessage });
      this.executorService.runExecutor(this.sessionId, this.newMessage).subscribe((response) => {
        this.newMessage.replaceAll('?', '');
        this.messages.push(response.message);
      });
      this.newMessage = ''; // Clear the input box after sending the message
    }
  }
}
