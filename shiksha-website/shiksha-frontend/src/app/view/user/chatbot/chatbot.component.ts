import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatbotService } from './chatbot.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilityService } from 'src/app/core/services/utility.service';
import { SidebarService } from 'src/app/layout/sidebar/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileImageComponent } from 'src/app/shared/components/profile-image/profile-image.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InstructionsPopupComponent } from 'src/app/shared/components/instructions-popup/instructions-popup.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalService } from 'src/app/shared/components/modal/modal.service';
import { ChatMarkdownModule } from './chat-markdown.module';

interface ChatMessages {
  answer?: string;
  question?: string;
  createdAt?: string;
  _id?: string;
  version?: number;
  references?: { title: string, url?: string, text?: string }[];
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ProfileImageComponent, InstructionsPopupComponent, ModalComponent, ChatMarkdownModule]
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('textArea') textArea!: ElementRef<any>;
  @ViewChild('header') header!: ElementRef<any>;

  messages: ChatMessages[] = [];
  loadingStatus: string = '';

  chatValue: any;

  isLoading = false;

  typeSubscription: Subscription;

  paramSubscription!: Subscription;

  type: any;

  recordId: any;

  chapterId: any;

  chapterDetails: any;

  showInstructions = false

  instructions = [
    {
      type: 'Science',
      description:
        '1. Incorporate a real-world scenario involving the use of reflective surfaces in everyday life, such as car mirrors or solar panels.<br><br>2. Add an experiment involving the use of mirrors to study the reflection of light, including practical applications of redirecting light using mirrors.<br><br>3. Include questions about the different types of asexual reproduction in plants, such as budding and fragmentation.<br><br>4. Suggest an activity where students compare the motion of different objects, such as a rolling ball and a sliding book, and analyze the factors affecting their speeds.<br><br>5. Introduce an experiment demonstrating the reaction of metals with acids, highlighting the production of hydrogen gas.',
    },
    {
      type: 'Social Science',
      description:
        '1. Add a discussion on the role of media in elections and how it influences public opinion.<br><br>Examine the principles of administration, foreign policy, and financial management in the Arthashastra and their application in the Mauryan and Kushan empires, including the roles of spies, the military system, and tax collection.<br><br>2. Discuss the historical transition from monarchies to democracies and its impact on decision-making in societies, using examples from the chapter.<br><br>3. Suggest students create a project on the role of government policies in shaping land use and agricultural development in India.<br><br>4. Compare the social structures and economic activities of urban, rural, and tribal communities, highlighting the impact of industrialization and urbanization.',
    },
    {
      type: 'Mathematics',
      description:
        "1. Suggest hands-on activities using materials like cardboard, string, or sticks to explore the properties of isosceles and equilateral triangles.<br><br>2. Add an experiment where students create and test the stability of different triangular structures using materials like straws or sticks.<br><br>Design interactive activities for both small and large groups that involve solving percentage problems through collaborative and competitive tasks.<br><br>3. Propose a real-world application where students calculate the area of an irregularly shaped plot of land using Heron's Formula, emphasizing the importance of accurate measurements.<br><br>4. Include MCQs that test understanding of the derivation of Heron's formula.<br><br>5. Include an explanation of the Pythagorean Theorem and its application in right triangles.",
    },
    {
      type: 'English',
      description:
        '1. Analyze the character traits of a merciful person based on the poem. How do these traits compare to those of a just person?<br><br>2. Write a paragraph about your favorite hobby using at least five adjectives. Highlight the adjectives.<br><br>3. Create ten sentences using different tenses (past, present, and future).<br><br>4. Write a four-line poem about your best friend.<br><br>5. Write a poem about your favorite season. Use vivid imagery to describe the sights, sounds, and feelings it evokes.<br><br>6. Suggest an activity to discuss personal experiences with insects that connect with the poem "The Fly."',
    }
  ];

  /**
   * Class constructor
   * @param chatbotService
   * @param sanitizer
   * @param utilityService
   */
  constructor(
    private chatbotService: ChatbotService,
    private sanitizer: DomSanitizer,
    public utilityService: UtilityService,
    public sidebarService: SidebarService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public modalService: ModalService,
    private translateService: TranslateService
  ) {
    this.typeSubscription = this.activatedRoute.data.subscribe((data: any) => {
      this.type = data.type;
    })

    if (this.type === 'index') {
      this.paramSubscription = this.activatedRoute.queryParams.subscribe(params => {
        this.recordId = params['recordId']
        this.chapterId = params['chapterId']
      });
    }
  }

  /**
   * ngOnInit lifecycle hook of angular used here to initialize chat messages
   */
  ngOnInit(): void {
    if (this.type === 'general') {
      this.getGeneralMessages();
    } else if (this.type === 'index') {
      this.getIndexMessages();
    } else {
      return
    }
  }

  /**
   * Function to have dynamic textarea height
   * @param textArea 
   */
  adjustHeight(textArea: HTMLTextAreaElement) {
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  }

  scrollToTextarea() {
    this.textArea.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  scrollToTop() {
    this.header.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Function to format chat response
   * @param text 
   * @returns 
   */
  transformText(text: string): SafeHtml {
    let transformedText = text
      .replace(/\\n/g, '<br>')
      .replace(/\\"/g, '"')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/###/g, '');
    return this.sanitizer.bypassSecurityTrustHtml(transformedText);
  }

  /**
   * Function to get messages
   */
  getGeneralMessages() {
    this.chatbotService.getGeneralMessages().subscribe({
      next: (res) => {
        this.messages = res.data.messages;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      },
    });
  }

  restartGeneralChat() {
    if (!confirm(this.translateService.instant('Start a new chat? Your current conversation will be closed.'))) {
      return;
    }

    this.isLoading = true;
    this.chatbotService.restartGeneralChat().subscribe({
      next: () => {
        this.isLoading = false;
        this.messages = [];
        this.chatValue = null;
        this.loadingStatus = '';
        this.utilityService.showSuccess(this.translateService.instant('New chat started'));
      },
      error: (err) => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      },
    });
  }

  /**
 * Function to get messages
 */
  getIndexMessages() {
    this.chatbotService.getIndexMessages(this.recordId, this.chapterId).subscribe({
      next: (res) => {
        this.messages = res.data.messages;
        this.chapterDetails = res?.data?.chapterDetails;
        this.chapterDetails.subject = this.utilityService.getSubjectDisplayName(res?.data?.subject);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      },
    });
  }

  /**
   * Function to send message
   * @returns 
   */
  sendMessage() {
    if (this.isLoading) {
      return;
    }
    if (this.chatValue.trim()) {
      const messageObj = {
        message: this.chatValue,
      };

      const questionObj: ChatMessages = {
        question: this.chatValue,
        answer: '',
        createdAt: '',
        _id: '',
      };

      this.messages.unshift(questionObj);

      this.chatValue = null;
      this.textArea.nativeElement.style.height = '36px';
      this.isLoading = true;

      if (this.type === 'general') {
        this.sendGeneralMessage(messageObj)
      } else {
        this.sendIndexMessage(messageObj)
      }

    }
  }

  sendGeneralMessage(messageObj: any) {
    // initialize empty message holder
    const responseMessage: ChatMessages = {
      question: '',
      answer: '',
      createdAt: new Date().toISOString(),
      _id: 'temp-id',
      references: []
    };
    this.messages.unshift(responseMessage);

    // We already unshifted the question in sendMessage, but wait.
    // sendMessage unshifts:
    /*
      const questionObj: ChatMessages = {
        question: this.chatValue,
        answer: '',
        createdAt: '',
        _id: '',
      };
      this.messages.unshift(questionObj);
    */
    // So the top message is the user question.
    // We need to append the answer to THIS message or add a new one?
    // The UI likely shows question and answer in same block or separate?
    // Looking at `messages` structure: `{ answer?: string; question?: string; ... }`
    // It seems each item in `messages` array is a Q&A pair.
    // So `messages[0]` is the current Q&A being built.

    this.chatbotService.sendGeneralMessage(messageObj).subscribe({
      next: (data) => {
        const currentMessage = this.messages[0];

        if (data.type === 'status') {
          // Show status. For now, maybe prepend to answer or distinct UI?
          // The user execution requested "loading states".
          // I will set a temporary property or simply use the answer field with a spinner/text if empty.
          // However, to be cleaner, let's use a separate property if possible, or just log it for now 
          // and update the answer text if it's "Thinking...".
          // Actually, let's append status to a "status" field if we had one.
          // Since we don't, I will use `isLoading` coupled with a status tracking variable if needed.
          // But `isLoading` is boolean.
          // Let's just assume `answer` is the content.
          // If we receive "status", we could show it as a placeholder?
          // Let's strictly handle 'content' for answer.
          // For 'status', I'll update a local variable `loadingStatus` and display it in template if I could edit HTML.
          // Since I am editing TS, I will create a variable `loadingStatus`.
          this.loadingStatus = data.message;
        } else if (data.type === 'content') {
          this.loadingStatus = ''; // Clear status when content starts
          currentMessage.answer = (currentMessage.answer || '') + data.delta;
        } else if (data.type === 'references') {
          currentMessage.references = data.data;
        } else if (data.type === 'error') {
          this.utilityService.showError(data.message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loadingStatus = '';
        this.utilityService.handleError(err);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingStatus = '';
        if (this.messages[0]?.answer) {
          const extractedRefs = this.extractReferences(this.messages[0].answer);
          if (extractedRefs.length > 0) {
            // Merge with existing references if any, avoiding duplicates
            const existingRefs = this.messages[0].references || [];
            const existingUrls = new Set(existingRefs.map(r => r.url));

            extractedRefs.forEach(ref => {
              if (!existingUrls.has(ref.url)) {
                existingRefs.push(ref);
                existingUrls.add(ref.url);
              }
            });
            this.messages[0].references = existingRefs;
          }
        }
      }
    });
  }

  extractReferences(text: string) {
    const references: { title: string, url: string, text?: string }[] = [];
    const seenUrls = new Set<string>();

    // Pass 1: Extract Markdown links [Title](URL)
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    let match;
    while ((match = markdownLinkRegex.exec(text)) !== null) {
      const title = match[1];
      let url = match[2];
      // Clean potential trailing punctuation if regex grabbed it
      if (url.endsWith(')')) url = url.slice(0, -1);

      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        references.push({ title, url });
      }
    }

    // Pass 2: Extract bare URLs
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(text)) !== null) {
      let url = urlMatch[1];
      // Clean common trailing punctuation from bare URLs
      url = url.replace(/[.,;)]$/, '');

      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        references.push({ title: url, url });
      }
    }

    return references;
  }

  sendIndexMessage(messageObj: any) {
    this.chatbotService.sendIndexMessage(messageObj, this.recordId, this.chapterId).subscribe({
      next: (res) => {
        if (res.data) {
          this.getIndexMessages();
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.messages.shift();
          this.utilityService.showError(err?.error?.message);
        } else {
          this.utilityService.handleError(err);
        }
        this.isLoading = false;
      },
    });
  }

  backNavigation() {
    this.router.navigate(['/content-generation'])
  }

  ngOnDestroy(): void {
    this.typeSubscription.unsubscribe();
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
}
