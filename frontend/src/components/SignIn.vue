<template>
  <div class="signin-container">
    <img src="../assets/icon.png" alt="Sign In Icon" class="signin-icon" />
    <h2 class="signin-text">Please Sign In</h2>
    <input
      type="email"
      v-model="email"
      placeholder="Email"
      class="signin-input"
    />
    <input
      type="password"
      v-model="password"
      placeholder="Password"
      class="signin-input"
    />
    <button @click="signIn" class="signin-button">Sign In</button>
    <p class="signin-footer">Abcd</p>
  </div>
</template>

<script>
import authService from "@/services/authService";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async signIn() {
      try {
        const response = await authService.signIn(this.email, this.password);
        
        localStorage.setItem("authToken", response.token);
        
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.error("Authentication failed:", error.message);
        alert("Authentication failed: " + error.message);
      }
    },
  },
};
</script>
  
  <style src="@/styles/components/SignIn.css"></style>
  <style src="@/styles/styles.css"></style>
  