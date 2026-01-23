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

// ✅ FIXED: Hardcoded correct Apps Script URL
const DEFAULT_API_URL =
  'https://script.google.com/macros/s/AKfycby-_1PSNwCKbjGwFDnFCbxb37_1ZJaBEZkuCKhqIEdxisWuvAVT9cmyq9HWOLcAEnx3/exec';

// API URL helper
export function getApiUrl(): string {
  return localStorage.getItem('gymApiUrl') || DEFAULT_API_URL;
}

// Admin password helpers
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
  console.log('ADD MEMBER CLICKED → sending to Apps Script', memberData);

  return postAdminAction({
    action: 'addMember',
    member: memberData
  });
}

export async function updateMember(
  memberData: Partial<Member> & { id: string }
): Promise<ApiResponse> {
  console.log('UPDATE MEMBER →', memberData);

  return postAdminAction({
    action: 'updateMember',
    member: memberData
  });
}

export async function renewMembership(
  renewalData: RenewalData
): Promise<ApiResponse> {
  console.log('RENEW MEMBER →', renewalData);

  return postAdminAction({
    action: 'renewMember',
    ...renewalData
  });
}

export async function deleteMember(
  memberId: string
): Promise<ApiResponse> {
  console.log('DELETE MEMBER →', memberId);

  return postAdminAction({
    action: 'deleteMember',
    memberId
  });
}

/* -------------------- CORE POST HANDLER -------------------- */

async function postAdminAction(payload: any): Promise<ApiResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();

  console.log('POST →', apiUrl, payload);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'   // ✅ IMPORTANT FIX
    },
    body: JSON.stringify({
      password,
      ...payload
    })
  });

  return response.json();
}

/* -------------------- AUTH -------------------- */

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
