import homeMock from "@/data/navpages/home.json";
import aboutMock from "@/data/navpages/about.json";
import solutionMock from "@/data/navpages/solution.json";
import blogsMock from "@/data/navpages/blogs.json";
import partnerMock from "@/data/navpages/partner.json";
import contactMock from "@/data/navpages/contact.json";
import {
  fetchHomePageData,
  fetchAboutPageData,
  fetchSolutionPageData,
  fetchBlogsPageData,
  fetchPartnerPageData,
  fetchContactPageData,
} from "@/services/marketing.service";

/**
 * Fetches live API data and falls back to local mock JSON.
 */
export async function getHomePageData() {
  try {
    return await fetchHomePageData();
  } catch {
    return homeMock;
  }
}

export async function getAboutPageData() {
  try {
    return await fetchAboutPageData();
  } catch {
    return aboutMock;
  }
}

export async function getSolutionPageData() {
  try {
    return await fetchSolutionPageData();
  } catch {
    return solutionMock;
  }
}

export async function getBlogsPageData() {
  try {
    return await fetchBlogsPageData();
  } catch {
    return blogsMock;
  }
}

export async function getPartnerPageData() {
  try {
    return await fetchPartnerPageData();
  } catch {
    return partnerMock;
  }
}

export async function getContactPageData() {
  try {
    return await fetchContactPageData();
  } catch {
    return contactMock;
  }
}
