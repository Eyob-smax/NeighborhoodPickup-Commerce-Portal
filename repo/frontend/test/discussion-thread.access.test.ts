/**
 * @vitest-environment jsdom
 */

import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../src/api/client";
import { useAuthStore } from "../src/stores/authStore";

const getThreadCommentsMock = vi.hoisted(() => vi.fn());
const trackEventMock = vi.hoisted(() => vi.fn());
const replaceMock = vi.hoisted(() => vi.fn());
const pushMock = vi.hoisted(() => vi.fn());
const routeState = vi.hoisted(() => ({
  params: { id: "77" },
  query: {},
}));

vi.mock("vue-router", () => ({
  useRoute: () => routeState,
  useRouter: () => ({
    replace: replaceMock,
    push: pushMock,
  }),
}));

vi.mock("../src/api/discussionApi", () => ({
  discussionApi: {
    getThreadComments: getThreadCommentsMock,
    createComment: vi.fn(),
    flagComment: vi.fn(),
  },
}));

vi.mock("../src/telemetry/trackEvent", () => ({
  trackEvent: trackEventMock,
}));

import DiscussionThreadPage from "../src/pages/discussion/DiscussionThreadPage.vue";

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("DiscussionThreadPage access handling", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    getThreadCommentsMock.mockReset();
    trackEventMock.mockReset();
    replaceMock.mockReset();
    pushMock.mockReset();
    routeState.params.id = "77";

    const authStore = useAuthStore();
    authStore.user = {
      id: 10,
      username: "reviewer1",
      roles: ["REVIEWER"],
    };
    authStore.initialized = true;
  });

  it("shows an error when thread access is forbidden", async () => {
    getThreadCommentsMock.mockRejectedValue(
      new ApiError("forbidden", 403, null, "THREAD_FORBIDDEN"),
    );

    const wrapper = mount(DiscussionThreadPage, {
      global: {
        stubs: {
          RouterLink: true,
          ThreadCommentCard: true,
        },
      },
    });

    await flush();

    expect(replaceMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("forbidden");
  });
});
