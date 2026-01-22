// Gym Membership API Client
// Connects to Google Apps Script backend

import type { Member, MemberLookupResponse, MembersListResponse, ApiResponse, NewMemberData, RenewalData } from '../types/member';

// API Base URL - This will be replaced with your actual Google Apps Script URL
// Instructions: After deploying your Apps Script, replace this URL
const API_BASE_URL = localStorage.getItem('gymApiUrl') || '';

// Helper function to get the API URL
export function getApiUrl(): string {
  return localStorage.getItem('gymApiUrl') || '';
}

// Helper function to set the API URL
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
 * Look up a member by ID (Public - Read Only)
 */
export async function lookupMember(memberId: string): Promise<MemberLookupResponse> {
  const apiUrl = getApiUrl();
  
  if (!apiUrl) {
    throw new Error('API URL not configured. Please set up the Google Apps Script URL first.');
  }

  try {
    const url = `${apiUrl}?action=lookup&id=${encodeURIComponent(memberId)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lookup error:', error);
    throw new Error('Failed to connect to the server. Please check your internet connection.');
  }
}

/**
 * Get all members (Admin only)
 */
export async function getAllMembers(): Promise<MembersListResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();
  
  if (!apiUrl) {
    throw new Error('API URL not configured.');
  }
  
  if (!password) {
    throw new Error('Admin authentication required.');
  }

  try {
    const url = `${apiUrl}?action=getAll&password=${encodeURIComponent(password)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get all members error:', error);
    throw new Error('Failed to fetch members.');
  }
}

/**
 * Add a new member (Admin only)
 */
export async function addMember(memberData: NewMemberData): Promise<ApiResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();
  
  if (!apiUrl || !password) {
    throw new Error('Authentication required.');
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Apps Script requires this
      },
      body: JSON.stringify({
        password,
        action: 'addMember',
        member: memberData,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Add member error:', error);
    throw new Error('Failed to add member.');
  }
}

/**
 * Update member details (Admin only)
 */
export async function updateMember(memberData: Partial<Member> & { id: string }): Promise<ApiResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();
  
  if (!apiUrl || !password) {
    throw new Error('Authentication required.');
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        password,
        action: 'updateMember',
        member: memberData,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Update member error:', error);
    throw new Error('Failed to update member.');
  }
}

/**
 * Renew membership (Admin only)
 */
export async function renewMembership(renewalData: RenewalData): Promise<ApiResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();
  
  if (!apiUrl || !password) {
    throw new Error('Authentication required.');
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        password,
        action: 'renewMember',
        ...renewalData,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Renew membership error:', error);
    throw new Error('Failed to renew membership.');
  }
}

/**
 * Delete member (Admin only)
 */
export async function deleteMember(memberId: string): Promise<ApiResponse> {
  const apiUrl = getApiUrl();
  const password = getAdminPassword();
  
  if (!apiUrl || !password) {
    throw new Error('Authentication required.');
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        password,
        action: 'deleteMember',
        memberId,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Delete member error:', error);
    throw new Error('Failed to delete member.');
  }
}

/**
 * Verify admin password by attempting to fetch all members
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const apiUrl = getApiUrl();
  
  if (!apiUrl) {
    throw new Error('API URL not configured.');
  }

  try {
    const url = `${apiUrl}?action=getAll&password=${encodeURIComponent(password)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.success) {
      setAdminPassword(password);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
