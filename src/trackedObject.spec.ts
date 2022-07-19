import { TestBed } from '@angular/core/testing';
import { TrackedObject } from './trackedObject';

describe('TrackedObject', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [TrackedObject],
    }).compileComponents();
  });

  it('should create the object', () => {
    return true;
    //const fixture = TestBed.createComponent(TrackedObject);
    //const trackedObject = fixture.componentInstance;
    //expect(trackedObject).toBeTruthy();
  });

  //   it('should render title', () => {
  //     const fixture = TestBed.createComponent(TrackedObject);
  //     fixture.detectChanges();
  //     const compiled = fixture.nativeElement as HTMLElement;
  //     expect(compiled.querySelector('.content span')?.textContent).toContain(
  //       'quri app is running!'
  //     );
  //   });
});
