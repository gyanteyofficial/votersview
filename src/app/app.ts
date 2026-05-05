import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PartyResult {
  name: string;
  shortName: string;
  color: string;
  leading: number;
  won: number;
}

export interface StateResult {
  state: string;
  totalSeats: number;
  parties: PartyResult[];
  headerColor: string;
  headerGradient: string;
  majorityMark: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  activeTab = signal<'general' | 'bye'>('general');
  lastUpdated = signal<string>('07:36 AM On 04/05/2026');
  currentTime = signal<string>('');
  showDisclaimer = signal<boolean>(true);

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  generalElections: StateResult[] = [
    {
      state: 'KERALA',
      totalSeats: 140,
      majorityMark: 71,
      headerColor: '#b45309',
      headerGradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
      parties: [
        { name: 'LDF (Left Democratic Front)', shortName: 'LDF', color: '#dc2626', leading: 12, won: 73 },
        { name: 'UDF (United Democratic Front)', shortName: 'UDF', color: '#2563eb', leading: 8, won: 49 },
        { name: 'NDA (BJP+)', shortName: 'NDA', color: '#f97316', leading: 2, won: 9 },
        { name: 'Others', shortName: 'OTH', color: '#6b7280', leading: 1, won: 4 },
        { name: 'Independents', shortName: 'IND', color: '#8b5cf6', leading: 0, won: 2 },
      ]
    },
    {
      state: 'PUDUCHERRY',
      totalSeats: 30,
      majorityMark: 16,
      headerColor: '#7c3aed',
      headerGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      parties: [
        { name: 'INC (Indian National Congress)', shortName: 'INC', color: '#2563eb', leading: 2, won: 11 },
        { name: 'AINRC', shortName: 'AINRC', color: '#dc2626', leading: 1, won: 8 },
        { name: 'DMK', shortName: 'DMK', color: '#1a1a1a', leading: 1, won: 5 },
        { name: 'BJP', shortName: 'BJP', color: '#f97316', leading: 0, won: 2 },
        { name: 'Others', shortName: 'OTH', color: '#6b7280', leading: 0, won: 2 },
      ]
    },
    {
      state: 'TAMIL NADU',
      totalSeats: 234,
      majorityMark: 118,
      headerColor: '#0f766e',
      headerGradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
      parties: [
        { name: 'DMK Alliance', shortName: 'DMK+', color: '#dc2626', leading: 18, won: 128 },
        { name: 'AIADMK Alliance', shortName: 'ADMK+', color: '#16a34a', leading: 7, won: 62 },
        { name: 'BJP', shortName: 'BJP', color: '#f97316', leading: 3, won: 10 },
        { name: 'DMDK', shortName: 'DMDK', color: '#7c3aed', leading: 1, won: 3 },
        { name: 'Others', shortName: 'OTH', color: '#6b7280', leading: 1, won: 4 },
      ]
    }
  ];

  byeElections: StateResult[] = [
    {
      state: 'MAHARASHTRA',
      totalSeats: 5,
      majorityMark: 3,
      headerColor: '#0369a1',
      headerGradient: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
      parties: [
        { name: 'Maha Vikas Aghadi', shortName: 'MVA', color: '#2563eb', leading: 1, won: 2 },
        { name: 'Mahayuti Alliance', shortName: 'MYT', color: '#f97316', leading: 0, won: 2 },
        { name: 'Others', shortName: 'OTH', color: '#6b7280', leading: 0, won: 0 },
      ]
    }
  ];

  ngOnInit() {
    this.updateTime();
    this.timerInterval = setInterval(() => this.updateTime(), 30000);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  updateTime() {
    const now = new Date();
    this.currentTime.set(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  }

  setTab(tab: 'general' | 'bye') {
    this.activeTab.set(tab);
  }

  dismissDisclaimer() {
    this.showDisclaimer.set(false);
  }

  getActiveElections(): StateResult[] {
    return this.activeTab() === 'general' ? this.generalElections : this.byeElections;
  }

  getTotalLeading(state: StateResult): number {
    return state.parties.reduce((acc, p) => acc + p.leading, 0);
  }

  getTotalWon(state: StateResult): number {
    return state.parties.reduce((acc, p) => acc + p.won, 0);
  }

  getLeadingParty(state: StateResult): PartyResult {
    return [...state.parties].sort((a, b) => (b.leading + b.won) - (a.leading + a.won))[0];
  }

  getBarWidth(party: PartyResult, total: number): number {
    const seats = party.leading + party.won;
    return total > 0 ? Math.round((seats / total) * 100) : 0;
  }

  hasMajority(state: StateResult): PartyResult | null {
    const leading = this.getLeadingParty(state);
    const total = leading.leading + leading.won;
    return total >= state.majorityMark ? leading : null;
  }

  getStatusColor(state: StateResult): string {
    const majority = this.hasMajority(state);
    return majority ? '#16a34a' : '#f97316';
  }
}
