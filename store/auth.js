import jwt_decode from "jwt-decode";
import { createClient } from '@supabase/supabase-js'
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwamtqcmZwaHF5d2Vsem5wa2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNDk4OTIsImV4cCI6MTk4OTgyNTg5Mn0._wwi-agtY8LScuU9MqLogT2BO05_57ADZatuJ4DQX90"
export const SUPABASE = createClient('https://hpjkjrfphqywelznpkei.supabase.co', SUPABASE_KEY)

export function getJwtToken() {
    return localStorage.getItem("accessToken")
}

export function getUserIdFromToken(token) {
    const decoded = jwt_decode(token);
    return decoded; //.user_id
}

export function setJwtToken(token) {
    localStorage.setItem("accessToken", token);
}

export function deleteJwtToken() {
    localStorage.removeItem("accessToken");
}

export function authHeader() {
  let accessToken = getJwtToken();

  if (accessToken) {
    // return { Authorization: "Bearer " + accessToken };
    return { Authorization: "Bearer " + accessToken };
  } else {
    return {};
  }
}

