import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { getAuthToken, setAuthToken, clearAuthToken } from "../authToken"

const localStorageMock = (() => {
    let store: Record<string, string> = {}

    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
            store[key] = value
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
        get length() {
            return Object.keys(store).length
        },
        key: (index: number) => Object.keys(store)[index] ?? null,
    }
})()

describe("authToken.ts", () => {
    beforeEach(() => {
        // Clear store before each test
        localStorageMock.clear()
        // @ts-ignore - Mock localStorage
        global.localStorage = localStorageMock
    })

    afterEach(() => {
        // @ts-ignore - Restore localStorage
        delete global.localStorage
    })

    describe("getAuthToken", () => {
        it("returns token when it exists in localStorage", () => {
            localStorageMock.setItem("auth_token", "test-token-123")
            const token = getAuthToken()
            expect(token).toBe("test-token-123")
        })

        it("returns null when token does not exist in localStorage", () => {
            const token = getAuthToken()
            expect(token).toBeNull()
        })

        it("returns null when localStorage is not available", () => {
            // @ts-ignore - Simulate unavailable localStorage
            global.localStorage = undefined
            const token = getAuthToken()
            expect(token).toBeNull()
        })

        it("returns null when localStorage.getItem throws an error", () => {
            // @ts-ignore - Mock localStorage that throws
            global.localStorage = {
                getItem: vi.fn(() => {
                    throw new Error("Storage access denied")
                }),
            }
            const token = getAuthToken()
            expect(token).toBeNull()
        })

        it("returns stored token as string without modification", () => {
            const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test"
            localStorageMock.setItem("auth_token", jwtToken)
            const token = getAuthToken()
            expect(token).toBe(jwtToken)
            expect(typeof token).toBe("string")
        })
    })

    describe("setAuthToken", () => {
        it("stores token in localStorage when valid string is provided", () => {
            setAuthToken("my-auth-token")
            expect(localStorageMock.getItem("auth_token")).toBe("my-auth-token")
        })

        it("stores JWT token without modification", () => {
            const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
            setAuthToken(jwtToken)
            expect(localStorageMock.getItem("auth_token")).toBe(jwtToken)
        })

        it("removes token from localStorage when null is provided", () => {
            localStorageMock.setItem("auth_token", "existing-token")
            expect(localStorageMock.getItem("auth_token")).toBe("existing-token")

            setAuthToken(null)
            expect(localStorageMock.getItem("auth_token")).toBeNull()
        })

        it("removes token from localStorage when undefined is provided", () => {
            localStorageMock.setItem("auth_token", "existing-token")
            expect(localStorageMock.getItem("auth_token")).toBe("existing-token")

            setAuthToken(undefined)
            expect(localStorageMock.getItem("auth_token")).toBeNull()
        })

        it("does not modify localStorage when empty string is provided", () => {
            localStorageMock.setItem("auth_token", "existing-token")
            setAuthToken("")
            // Empty string is falsy but not null/undefined, so it should remove the token
            expect(localStorageMock.getItem("auth_token")).toBeNull()
        })

        it("does nothing when localStorage is not available", () => {
            // @ts-ignore - Simulate unavailable localStorage
            global.localStorage = undefined
            // Should not throw
            expect(() => setAuthToken("test-token")).not.toThrow()
        })

        it("does nothing when localStorage.setItem throws an error", () => {
            // @ts-ignore - Mock localStorage that throws on setItem
            global.localStorage = {
                setItem: vi.fn(() => {
                    throw new Error("Quota exceeded")
                }),
            }
            // Should not throw
            expect(() => setAuthToken("test-token")).not.toThrow()
        })

        it("overwrites existing token with new value", () => {
            setAuthToken("first-token")
            expect(localStorageMock.getItem("auth_token")).toBe("first-token")

            setAuthToken("second-token")
            expect(localStorageMock.getItem("auth_token")).toBe("second-token")
            // Should only have one entry (use localStorage.length)
            expect(localStorageMock.length).toBe(1)
        })
    })

    describe("clearAuthToken", () => {
        it("removes token from localStorage when it exists", () => {
            localStorageMock.setItem("auth_token", "test-token")
            expect(localStorageMock.getItem("auth_token")).toBe("test-token")

            clearAuthToken()
            expect(localStorageMock.getItem("auth_token")).toBeNull()
        })

        it("does nothing when token does not exist", () => {
            expect(localStorageMock.getItem("auth_token")).toBeNull()
            // Should not throw
            expect(() => clearAuthToken()).not.toThrow()
            expect(localStorageMock.getItem("auth_token")).toBeNull()
        })

        it("does nothing when localStorage is not available", () => {
            // @ts-ignore - Simulate unavailable localStorage
            global.localStorage = undefined
            // Should not throw
            expect(() => clearAuthToken()).not.toThrow()
        })

        it("does nothing when localStorage.removeItem throws an error", () => {
            // @ts-ignore - Mock localStorage that throws on removeItem
            global.localStorage = {
                removeItem: vi.fn(() => {
                    throw new Error("Storage access denied")
                }),
            }
            // Should not throw
            expect(() => clearAuthToken()).not.toThrow()
        })
    })

    describe("integration scenarios", () => {
        it("completes full token lifecycle", () => {
            // Initially no token
            expect(getAuthToken()).toBeNull()

            // Set token
            setAuthToken("lifecycle-token")
            expect(getAuthToken()).toBe("lifecycle-token")

            // Clear token
            clearAuthToken()
            expect(getAuthToken()).toBeNull()
        })

        it("handles multiple set and clear operations", () => {
            setAuthToken("token-1")
            expect(getAuthToken()).toBe("token-1")

            clearAuthToken()
            expect(getAuthToken()).toBeNull()

            setAuthToken("token-2")
            expect(getAuthToken()).toBe("token-2")

            setAuthToken("token-3")
            expect(getAuthToken()).toBe("token-3")

            clearAuthToken()
            expect(getAuthToken()).toBeNull()
        })

        it("handles setAuthToken with null after setting a token", () => {
            setAuthToken("initial-token")
            expect(getAuthToken()).toBe("initial-token")

            setAuthToken(null)
            expect(getAuthToken()).toBeNull()
        })

        it("preserves other localStorage entries", () => {
            localStorageMock.setItem("other_key", "other_value")
            localStorageMock.setItem("user_preferences", '{"theme":"dark"}')

            setAuthToken("auth-value")

            expect(localStorageMock.getItem("auth_token")).toBe("auth-value")
            expect(localStorageMock.getItem("other_key")).toBe("other_value")
            expect(localStorageMock.getItem("user_preferences")).toBe('{"theme":"dark"}')
        })

        it("only removes auth_token when clearing", () => {
            localStorageMock.setItem("auth_token", "secret-token")
            localStorageMock.setItem("session_data", "session-info")
            localStorageMock.setItem("user_settings", "settings")

            clearAuthToken()

            expect(localStorageMock.getItem("auth_token")).toBeNull()
            expect(localStorageMock.getItem("session_data")).toBe("session-info")
            expect(localStorageMock.getItem("user_settings")).toBe("settings")
        })
    })
})
