import jwt_decode from "jwt-decode";

export const API = "http://ec2-54-219-6-20.us-west-1.compute.amazonaws.com:8000"
// const API = "https://d1shlwd9bc483j.cloudfront.net"
// Test http connection with AWS Amplify/Beanstalk/Lightsail
// Netlify hosting doesn't allow API connections over http
// AWS EC2 not responding over https

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
    return { Authorization: "Bearer " + accessToken };
  } else {
    return {};
  }
}

