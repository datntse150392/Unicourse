import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../shared';
import { Track, TrackStep } from '../../../cores/models';

@Component({
  selector: 'app-list-track',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-track.component.html',
  styleUrl: './list-track.component.scss'
})
export class ListTrackComponent {
  @Input() tracks!: Track[];

  ngOnInit(): void {
    this.tracks = this.tracks.sort((a, b) => a.position - b.position);
    this.tracks.forEach((track) => {
      track.track_steps = this.sortTracksByPosition(track.track_steps);
    });
  }

  // Xử lý sort track theo position
  sortTracksByPosition(trackStep: TrackStep[]): TrackStep[] {
    return trackStep.sort((a, b) => a.position - b.position);
  }
}
