/**
 * @vitest-environment jsdom
 */

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getNotificationsMock = vi.hoisted(() => vi.fn());
const setNotificationReadStateMock = vi.hoisted(() => vi.fn());
const routeState = vi.hoisted(() => ({
  query: {} as Record<string, string>,
}));

vi.mock("vue-router", () => ({
  useRoute: () => routeState,
}));

vi.mock("../src/api/discussionApi", () => ({
  discussionApi: {
    getNotifications: getNotificationsMock,
    setNotificationReadState: setNotificationReadStateMock,
  },
}));

import NotificationCenterPage from "../src/pages/NotificationCenterPage.vue";

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe("NotificationCenterPage states", () => {
  beforeEach(() => {
    getNotificationsMock.mockReset();
    setNotificationReadStateMock.mockReset();
    routeState.query = {};
  });

  it("shows empty state when no notifications are returned", async () => {
    getNotificationsMock.mockResolvedValue({
      page: 1,
      pageSize: 20,
      total: 0,
      data: [],
    });

    const wrapper = mount(NotificationCenterPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });
    await flush();

    expect(wrapper.text()).toContain("No notifications.");
  });

  it("shows error state when notification fetch fails", async () => {
    getNotificationsMock.mockRejectedValue(new Error("backend unavailable"));

    const wrapper = mount(NotificationCenterPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });
    await flush();

    expect(wrapper.text()).toContain("backend unavailable");
  });

  it("renders loaded notifications and updates read state", async () => {
    getNotificationsMock.mockResolvedValue({
      page: 1,
      pageSize: 20,
      total: 1,
      data: [
        {
          id: 99,
          notificationType: "MENTION",
          sourceCommentId: 17,
          discussionId: 5,
          message: "you were mentioned",
          readState: "UNREAD",
          createdAt: "2026-03-29T12:00:00.000Z",
          readAt: null,
        },
      ],
    });
    setNotificationReadStateMock.mockResolvedValue({
      notificationId: 99,
      readState: "READ",
    });

    const wrapper = mount(NotificationCenterPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    await flush();
    expect(wrapper.text()).toContain("you were mentioned");

    const toggleButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Mark Read"));

    expect(toggleButton).toBeDefined();
    await toggleButton!.trigger("click");

    expect(setNotificationReadStateMock).toHaveBeenCalledWith(99, "READ");
  });

  it("shows role-policy notice and suppresses reopen link for denied thread", async () => {
    routeState.query = {
      threadAccessDenied: "1",
      deniedThreadId: "5",
    };

    getNotificationsMock.mockResolvedValue({
      page: 1,
      pageSize: 20,
      total: 1,
      data: [
        {
          id: 100,
          notificationType: "REPLY",
          sourceCommentId: 18,
          discussionId: 5,
          message: "new reply",
          readState: "UNREAD",
          createdAt: "2026-03-29T12:00:00.000Z",
          readAt: null,
        },
      ],
    });

    const wrapper = mount(NotificationCenterPage, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    await flush();

    expect(wrapper.text()).toContain(
      "Thread #5 is restricted by role policy for ORDER discussions.",
    );
    expect(wrapper.text()).toContain("Unavailable for your role");
    expect(wrapper.text()).not.toContain("Open Thread");
  });
});
