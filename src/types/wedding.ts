export type SceneChapterId =
  | 'blue-door'
  | 'entrance-aisle'
  | 'wedding-stage'
  | 'ocean-drone'
  | 'couple-intro'
  | 'love-story'
  | 'celebration'
  | 'countdown'
  | 'gallery'
  | 'rsvp'
  | 'sunset-finale';

export type CameraPresetId =
  | 'scroll-auto'
  | 'door-exterior'
  | 'aisle-walk'
  | 'stage-front'
  | 'stage-orbit-180'
  | 'drone-aerial'
  | 'sunset-shore';

export interface WeddingConfig {
  brideName: string;
  groomName: string;
  brandTitle: string;
  weddingDateISO: string;
  weddingDateDisplay: string;
  destinationName: string;
  destinationLocation: string;
   coordinates: string;
  hashtag: string;
  rsvpWebhookUrl: string;
}

export interface LoveStoryMilestone {
  id: string;
  chapter: string;
  year: string;
  location: string;
  coordinates: string;
  title: string;
  quote: string;
  description: string;
  image: string;
  accentColor: string;
}

export interface CelebrationEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  venueArea: string;
  dressCode: string;
  palette: { name: string; hex: string }[];
  description: string;
  highlights: string[];
  mapUrl: string;
  image: string;
  timeOfDayMood: 'afternoon' | 'golden-hour' | 'twilight';
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'destination' | 'stage' | 'couple' | 'details';
  location: string;
  caption: string;
  cameraSpec: string;
  aspect: 'wide' | 'tall' | 'square';
  image: string;
}

export interface RSVPSubmission {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  guestsCount: number;
  attending: 'yes' | 'no' | 'joyfully-online';
  eventsAttending: string[];
  dietaryNotes: string;
  songRequest: string;
  message: string;
  submittedAt: string;
}
