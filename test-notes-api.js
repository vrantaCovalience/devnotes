#!/usr/bin/env node

/**
 * Test script for Notes API endpoints
 *
 * Prerequisites:
 * 1. Start the development server: npm run dev
 * 2. Ensure database is running: npm run docker:up
 * 3. Ensure database is seeded: npm run db:seed
 * 4. Run this script: node test-notes-api.js
 */

const BASE_URL = "http://localhost:3000";

// Test credentials from seed data
const TEST_USER = {
  username: "alice",
  password: "password123",
};

let sessionCookie = "";

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(sessionCookie && { Cookie: sessionCookie }),
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  console.log(`\n🚀 ${finalOptions.method || "GET"} ${url}`);
  if (finalOptions.body) {
    console.log("📤 Request body:", finalOptions.body);
  }

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.text();

    // Store session cookie from login
    if (endpoint === "/api/auth/login" && response.ok) {
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) {
        sessionCookie = setCookie.split(";")[0];
        console.log("🍪 Session cookie stored");
      }
    }

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    try {
      const jsonData = JSON.parse(data);
      console.log("📥 Response:", JSON.stringify(jsonData, null, 2));
      return { response, data: jsonData };
    } catch {
      console.log("📥 Response (text):", data);
      return { response, data };
    }
  } catch (error) {
    console.error("❌ Request failed:", error.message);
    return { error };
  }
}

async function testNotesAPI() {
  console.log("🧪 Starting Notes API Test Suite\n");
  console.log("=".repeat(50));

  // Step 1: Login to get session
  console.log("\n1️⃣  AUTHENTICATION TEST");
  const loginResult = await makeRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(TEST_USER),
  });

  if (!loginResult.response?.ok) {
    console.error("❌ Login failed. Cannot proceed with API tests.");
    return;
  }

  console.log("✅ Login successful");

  // Step 2: Test GET /api/notes (fetch all notes)
  console.log("\n2️⃣  GET ALL NOTES TEST");
  const getAllResult = await makeRequest("/api/notes");

  if (getAllResult.response?.ok) {
    console.log(`✅ Retrieved ${getAllResult.data?.data?.length || 0} notes`);
  } else {
    console.log("❌ Failed to retrieve notes");
  }

  // Step 3: Test POST /api/notes (create new note)
  console.log("\n3️⃣  CREATE NOTE TEST");
  const newNote = {
    title: "API Test Note",
    content: "This note was created by the API test script.",
    category: "Testing",
    tags: ["api", "test", "automation"],
    pinned: false,
  };

  const createResult = await makeRequest("/api/notes", {
    method: "POST",
    body: JSON.stringify(newNote),
  });

  let createdNoteId = null;
  if (createResult.response?.ok && createResult.data?.data?.id) {
    createdNoteId = createResult.data.data.id;
    console.log(`✅ Note created with ID: ${createdNoteId}`);
  } else {
    console.log("❌ Failed to create note");
  }

  // Step 4: Test GET /api/notes/[id] (fetch single note)
  if (createdNoteId) {
    console.log("\n4️⃣  GET SINGLE NOTE TEST");
    const getSingleResult = await makeRequest(`/api/notes/${createdNoteId}`);

    if (getSingleResult.response?.ok) {
      console.log("✅ Retrieved single note successfully");
    } else {
      console.log("❌ Failed to retrieve single note");
    }
  }

  // Step 5: Test PUT /api/notes/[id] (update note)
  if (createdNoteId) {
    console.log("\n5️⃣  UPDATE NOTE TEST");
    const updateData = {
      title: "Updated API Test Note",
      content: "This note content has been updated via API.",
      pinned: true,
    };

    const updateResult = await makeRequest(`/api/notes/${createdNoteId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });

    if (updateResult.response?.ok) {
      console.log("✅ Note updated successfully");
    } else {
      console.log("❌ Failed to update note");
    }
  }

  // Step 6: Test filtering
  console.log("\n6️⃣  FILTER NOTES TEST");
  const filterResult = await makeRequest(
    "/api/notes?category=Testing&pinned=true"
  );

  if (filterResult.response?.ok) {
    console.log(
      `✅ Filter test passed - found ${
        filterResult.data?.data?.length || 0
      } matching notes`
    );
  } else {
    console.log("❌ Filter test failed");
  }

  // Step 7: Test search
  console.log("\n7️⃣  SEARCH NOTES TEST");
  const searchResult = await makeRequest("/api/notes?search=API");

  if (searchResult.response?.ok) {
    console.log(
      `✅ Search test passed - found ${
        searchResult.data?.data?.length || 0
      } matching notes`
    );
  } else {
    console.log("❌ Search test failed");
  }

  // Step 8: Test DELETE /api/notes/[id] (delete note)
  if (createdNoteId) {
    console.log("\n8️⃣  DELETE NOTE TEST");
    const deleteResult = await makeRequest(`/api/notes/${createdNoteId}`, {
      method: "DELETE",
    });

    if (deleteResult.response?.ok) {
      console.log("✅ Note deleted successfully");
    } else {
      console.log("❌ Failed to delete note");
    }
  }

  // Step 9: Verify deletion
  if (createdNoteId) {
    console.log("\n9️⃣  VERIFY DELETION TEST");
    const verifyResult = await makeRequest(`/api/notes/${createdNoteId}`);

    if (verifyResult.response?.status === 404) {
      console.log("✅ Deletion verified - note not found (expected)");
    } else {
      console.log("❌ Deletion verification failed - note still exists");
    }
  }

  // Step 10: Test error cases
  console.log("\n🔟 ERROR HANDLING TESTS");

  // Test invalid note ID
  const invalidIdResult = await makeRequest("/api/notes/invalid-id");
  if (invalidIdResult.response?.status === 404) {
    console.log("✅ Invalid note ID handling works");
  } else {
    console.log("❌ Invalid note ID handling failed");
  }

  // Test unauthorized access (logout first)
  await makeRequest("/api/auth/logout", { method: "POST" });
  sessionCookie = ""; // Clear session

  const unauthorizedResult = await makeRequest("/api/notes");
  if (unauthorizedResult.response?.status === 401) {
    console.log("✅ Unauthorized access prevention works");
  } else {
    console.log("❌ Unauthorized access prevention failed");
  }

  console.log("\n" + "=".repeat(50));
  console.log("🏁 Notes API Test Suite Complete");
  console.log("=".repeat(50));
}

// Run the tests
testNotesAPI().catch(console.error);
