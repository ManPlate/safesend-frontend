const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");

// Replace this with your deployed Edge Function URL
const FUNCTION_URL = "https://cibkejtziawkotknqshu.supabase.co/functions/v1/upload";

uploadBtn.addEventListener("click", async () => {
  if (!fileInput.files.length) {
    status.textContent = "Please select a file first.";
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  status.textContent = "Uploading...";

  try {
    // ✅ Step 1: Get current Supabase session
    const session = supabase.auth.session(); // Make sure user is signed in
    if (!session) {
      status.textContent = "Error: You must be signed in to upload.";
      return;
    }

    // ✅ Step 2: Extract JWT from session
    const jwt = session.access_token;

    // ✅ Step 3: Include JWT in the Authorization header
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}` // JWT included here
      },
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      status.textContent = `Upload successful! Link: ${data.link}`;
    } else {
      // Sometimes Supabase returns 'message' instead of 'error'
      status.textContent = `Error: ${data.error || data.message}`;
    }
  } catch (err) {
    status.textContent = `Error: ${err.message}`;
  }
});
