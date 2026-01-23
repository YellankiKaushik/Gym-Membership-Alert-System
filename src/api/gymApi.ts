// Gym Membership API Client
// Connects to Google Apps Script backend

import type {
  Member,
  MemberLookupResponse,
  MembersListResponse,
  ApiResponse,
  NewMemberData,
  RenewalData
} from '../types/member';

/**
 * CHANGE 1:
 * Hard-set your deployed Google Apps Script Web App URL here
 * (This guarantees requests always hit the sheet)
 */
const DEFAULT_API_URL =
  'https://script.google.com/macros/s/AKfycby-_1PSNwCKbjGwFDnFCbxb37_1ZJaBEZkuCKhqIEdxisWuvAVT9cmyq9HWOLcAEnx3/exec';


// Helper function to get the API URL
export function getApiUrl(): string {
  return localStorage.getItem('gymApiUrl') || DEFAULT_API_URL;
}

// Helper function to set the API URL (optional override)
export function setApiUrl(url: string): void {
  localStorage.setItem('gymApiUrl', url);
}

// Helper function to get admin password
export function getAdminPassword(): string {
  return sessionStorage.getItem('gymAdminPassword') || '';
}

// Helper function to set admin password (session only)
export function setAdminPassword(password: string): void {
  sessionStorage.setItem('gymAdminPassword', password);
}

// Helper function to clear admin session
export function clearAdminSession(): void {
  sessionStorage.removeItem('gymAdminPassword');
}

// Check if admin is logged in
export function isAdminLoggedIn(): boolean {
  return !!sessionStorage.getItem('gymAdminPassword');
}

/**
 * Public: Look up member by ID
 * (Uses GET → correct for your Apps Script doGet)
 */
export async function lookupMember(memberId: string): Promise<MemberLookupResponse> {
  const apiUrl = getApiUrl();

  const url = `${apiUrl}?action=lookup&id=${encodeURIComponent(memberId)}`;
  const response = await fetch(url);
  return response.json();
}

/**
 * Admin: Get all members
 * (Uses GET → correct for doGet)
 */
export async function getAllMembers(): Promise<MembersListResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();

  const url = `${apiUrl}?action=getAll&password=${encodeURIComponent(password)}`;
  const response = await fetch(url);
  return response.json();
}

/**
 * CHANGE 2:
 * All CRUD actions → POST → JSON body → action + password
 */

export async function addMember(
  memberData: NewMemberData
): Promise<ApiResponse> {
  return postAdminAction({
    action: 'addMember',
    member: memberData
  });
}

export async function updateMember(
  memberData: Partial<Member> & { id: string }
): Promise<ApiResponse> {
  return postAdminAction({
    action: 'updateMember',
    member: memberData
  });
}

export async function renewMembership(
  renewalData: RenewalData
): Promise<ApiResponse> {
  return postAdminAction({
    action: 'renewMember',
    ...renewalData
  });
}

export async function deleteMember(
  memberId: string
): Promise<ApiResponse> {
  return postAdminAction({
    action: 'deleteMember',
    memberId
  });
}

/**
 * Centralized POST helper
 * (Ensures all requests hit Apps Script correctly)
 */
async function postAdminAction(payload: any): Promise<ApiResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain' // REQUIRED for Apps Script
    },
    body: JSON.stringify({
      password,
      ...payload
    })
  });

  return response.json();
}

/**
 * Verify admin password
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const apiUrl = getApiUrl();
  const url = `${apiUrl}?action=getAll&password=${encodeURIComponent(password)}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.success) {
    setAdminPassword(password);
    return true;
  }
  return false;
}
