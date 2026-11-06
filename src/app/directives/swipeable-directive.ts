import { Directive, ElementRef, Renderer2, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appSwipeable]',
  standalone: true
})
export class SwipeableDirective {
  @Output() swiped = new EventEmitter<void>();

  private isDragging = false;
  private startX = 0;
  private currentX = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (!event.touches.length) return;
    this.isDragging = true;
    this.startX = event.touches[0].clientX - this.currentX;
    
    // Remove transitions for immediate touch responsiveness
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'none');
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || !event.touches.length) return;
    
    let newX = event.touches[0].clientX - this.startX;
    const elementWidth = this.el.nativeElement.offsetWidth;

    // Bounds checking: Lock between 0 and full negative width
    if (newX > 0) newX = 0;
    if (newX < -elementWidth) newX = -elementWidth+30;

    this.currentX = newX;
    this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(${this.currentX}px, 0, 0)`);

    // --- REAL-TIME OPACITY CALCULATION ---
    // Start fading once swiped past 50% of its width
    const swipePercentage = Math.abs(this.currentX) / elementWidth;
    if (swipePercentage > 0.5) {
      // Map 50% -> 100% swipe to 1.0 -> 0.0 opacity
      const opacity = 1 - ((swipePercentage - 0.5) / 0.5);
      this.renderer.setStyle(this.el.nativeElement, 'opacity', opacity.toString());
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    }
  }

    @HostListener('touchend')
  onTouchEnd(): void {
    this.isDragging = false;
    const elementWidth = this.el.nativeElement.offsetWidth;
    const swipeThreshold = -(elementWidth * 0.5); 

    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.2s ease-out, opacity 0.2s ease-out');

    if (this.currentX <= swipeThreshold) {
      // 1. Lock it precisely at the left edge and fade it to absolute 0
      this.currentX = -elementWidth;
      this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(${this.currentX}px, 0, 0)`);
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');

      // 2. Alert the parent component right away to delete it from the data array
      setTimeout(() => {
        this.swiped.emit();
        // REMOVED: Do not reset styles here, let the DOM element destroy naturally!
      }, 200);
      
    } else {
      // Snap back cleanly if dropped before the middle
      this.currentX = 0;
      this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(0, 0, 0)`);
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
    }
  }
}
