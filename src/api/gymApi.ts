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

// ✅ Hardcoded correct Apps Script URL
const DEFAULT_API_URL =
  'https://script.google.com/macros/s/AKfycbx9Q1y8_ujKpg_VwnKPCGucQV2EZti2sOFnvkIv6Vndi1RL5CKKpplYGJbKzky1YUE7/exec';

/* -------------------- API URL HELPERS -------------------- */

// ✅ REQUIRED for Setup.tsx
export function setApiUrl(url: string): void {
  localStorage.setItem('gymApiUrl', url);
}

export function getApiUrl(): string {
  return localStorage.getItem('gymApiUrl') || DEFAULT_API_URL;
}

/* -------------------- AUTH HELPERS -------------------- */

export function getAdminPassword(): string {
  return sessionStorage.getItem('gymAdminPassword') || '';
}

export function setAdminPassword(password: string): void {
  sessionStorage.setItem('gymAdminPassword', password);
}

export function clearAdminSession(): void {
  sessionStorage.removeItem('gymAdminPassword');
}

export function isAdminLoggedIn(): boolean {
  return !!sessionStorage.getItem('gymAdminPassword');
}

/* -------------------- PUBLIC API -------------------- */

export async function lookupMember(
  memberId: string
): Promise<MemberLookupResponse> {
  const url = `${getApiUrl()}?action=lookup&id=${encodeURIComponent(memberId)}`;
  return (await fetch(url)).json();
}

export async function getAllMembers(): Promise<MembersListResponse> {
  const password = getAdminPassword();
  const url = `${getApiUrl()}?action=getAll&password=${encodeURIComponent(password)}`;
  return (await fetch(url)).json();
}

/* -------------------- ADMIN CRUD -------------------- */

export async function addMember(
  memberData: NewMemberData
): Promise<ApiResponse> {
  console.log('ADD MEMBER →', memberData);

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

/* -------------------- CORE ACTION HANDLER -------------------- */

async function postAdminAction(payload: any): Promise<ApiResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      // ✅ REQUIRED for Apps Script + GitHub Pages
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      password,
      ...payload
    })
  });

  return response.json();
}

/* -------------------- VERIFY ADMIN -------------------- */

export async function verifyAdminPassword(
  password: string
): Promise<boolean> {
  const url = `${getApiUrl()}?action=getAll&password=${encodeURIComponent(password)}`;
  const data = await (await fetch(url)).json();

  if (data.success) {
    setAdminPassword(password);
    return true;
  }
  return false;
}
