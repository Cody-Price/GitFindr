import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

export interface User {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  score: number;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
}

export interface UserSearchResponse {
  incomplete_results: boolean;
  total_count: number;
  items: User[];
}

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  searchBar = new FormControl('');
  totalResults: number = 0;
  users: User[] = [];
  currentPage: number = 1;
  totalPages: number[] = [];

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {

  }

  fetchSearchResults(pageNumber: number): void {
    const pagePrefix: string = '&page=';
    this.http.get<UserSearchResponse>(`https://api.github.com/search/users?q=${this.searchBar.value}${pagePrefix}${pageNumber}`)
      .subscribe((data: UserSearchResponse) => {
        console.log('DATA:', data);
        this.users = data.items;
        this.totalResults = data.total_count;
        const totalPages: number = data.total_count / 30;
        for(let i = 0; i < totalPages; i++) {
          this.totalPages.push(i);
        }
    });
  }

  trackById(index: number, user: User): number {
    return user.id;
  }

  trackByIndex(index: number): number {
    return index;
  }

  navigateToUserGithub(user: User): void {
    document.location.href = user.html_url;
  }

  nextPage(): void {
    // if ((this.totalResults / 30) < this.currentPage) {
      this.currentPage++;
    // }
    // this.fetchSearchResults();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    // this.fetchSearchResults();
  }

  queryByPage(pageNumber: number): void {
    this.fetchSearchResults(pageNumber);
  }
}
