<template>
  <div class="homepage">
    <div class="logo-container">
      <img src="@/assets/icon.png" alt="Logo" class="logo-icon" />
    </div>

    <div class="profile-menu" @click.stop>
      <img
        src="@/assets/profile.png"
        alt="Profile"
        class="profile-icon"
        @click="toggleDropdown"
      />
      <span
        class="dropdown-arrow"
        :class="{ rotate: isDropdownVisible }"
        @click="toggleDropdown"
        >&#9662;</span
      >
      <div v-if="isDropdownVisible" class="dropdown-menu">
        <ul>
          <li @click="logout">Logout</li>
          <li @click="turkey">Turkey</li>
          <li @click="other">Other</li>
        </ul>
      </div>
    </div>
    <div class="table-container">
    <table class="parameter-table">
      <thead>
        <tr>
          <th>Parameter Key</th>
          <th>Value</th>
          <th>Description</th>
          <th @click="sortElements" >
            Create Date
            <span :class="sort === 'ASC' ? 'arrow-down' : 'arrow-up'"></span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="parameter in parameters" :key="parameter.id">
          <td v-if="editId === parameter.id">
            <input type="text" v-model="editedParameter.parameterKey"/>
          </td>
          <td :data-label="'Parameter Key'" v-else>
            {{ parameter.parameterKey }}
          </td>
          <td v-if="editId === parameter.id">
            <input type="text" v-model="editedParameter.value" />
          </td>
          <td :data-label="'Value'" v-else>
            {{ parameter.value }}
          </td>
          <td v-if="editId === parameter.id">
            <input type="text" v-model="editedParameter.description"  />
          </td>
          <td :data-label="'Description'" v-else>
            {{ parameter.description }}
          </td>
          <td :data-label="'Create Date'">
            {{ parameter.createDate }}
          </td>
          
          <td>
            <button
              v-if="editId === parameter.id"
              class="btn-common btn-save"
              @click="saveParameter(parameter.id)"
            >
              Save
            </button>
            <button
              v-if="editId === parameter.id"
              class="btn-common btn-cancel"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button
              v-else
              class="btn-edit"
              @click="editParameter(parameter.id)"
            >
              Edit
            </button>
            <button
              v-if="editId !== parameter.id"
              class="btn-delete"
              @click="deleteParameter(parameter.id)"
            >
              Delete
            </button>
          </td>
        </tr>

        <tr>
          <td :data-label="'Parameter Key'">
            <input
              type="text"
              v-model="newParameter.parameterKey"
              placeholder="New Parameter Key"
            />
          </td>

          <td :data-label="'Value'">
            <input
              type="text"
              v-model="newParameter.value"
              placeholder="New Value"
            />
          </td>

          <td :data-label="'Description'" colspan="2"><input type="text" v-model="newParameter.description" placeholder="New Description" /></td>

          
          <td></td>
          <td>
            <button class="btn-add" @click="addParameter">ADD</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>

  </div>
</template>


<script>
import { apiFetch } from '@/services/api';
export default {
  data() {
    return {
      parameters: [],
      code: "UK",
      sort: "ASC",
      newParameter: {
        parameterKey: "",
        value: "",
        description: "",
        createDate: "",
      },
      isDropdownVisible: false,
      editId: null,
      editedParameter: {},
    };
  },
  created(){
    if(!localStorage.getItem("authToken")){
      alert("Returning to sign in page you are not authenticated");
      this.$router.push("Sign In")
    }
    this.fetchParameters();
  },
  mounted() {
    this.fetchParameters();
  },
  methods: {
    async fetchParameters() {
      try {
        const query = "?countryCode=" + this.code + "&" + "sort=" + this.sort;
        const data = await apiFetch(query, { method: "GET" });

        this.parameters = data.map(param => ({
          id: param.id,
          parameterKey: param.parameterKey,
          value: param.value,
          description: param.description,
          createDate: param.createDate
        }));
        console.log("Mapped parameters:", this.parameters);
      } catch (error) {
        console.error("Error fetching parameters:", error);
      }
    },


    async addParameter() {
      const newParameter = {
        parameterKey: this.newParameter.parameterKey,
        value: this.newParameter.value,
        description: this.newParameter.description
      };

  try {
    const createdParameter = await apiFetch("/", {
      method: "POST",
      body: JSON.stringify(newParameter),
    });

      const parameter = {
        id: createdParameter.id,
        parameterKey: createdParameter.parameterKey,
        value: createdParameter.value,
        description: createdParameter.description,
        createDate: createdParameter.createDate
      };

    this.parameters.push(parameter);
    this.newParameter = { parameterKey: "", value: "", description: "", createDate: ""};
  } catch (error) {
    console.error("Error adding parameter:", error);
  }
}
,
    editParameter(id) {
      this.editId = id;
      const parameter = this.parameters.find(param => param.id === id);
      if (parameter) {
        this.editedParameter = { ...parameter };
        console.log('Editing parameter:', this.editedParameter);
      } else {
        console.error(`Parameter with id ${id} not found.`);
      }
    },
    async saveParameter(id) {
      const updatedParameter = { ...this.editedParameter };

      const parameterToUpdate = {
        parameterKey: updatedParameter.parameterKey,
        value: updatedParameter.value,
        description: updatedParameter.description,
        createDate: updatedParameter.createDate
      };

      try {
        await apiFetch(`/${id}`, {
          method: "PUT",
          body: JSON.stringify(parameterToUpdate),
        });

        const index = this.parameters.findIndex(param => param.id === id);
        if (index !== -1) {
          this.parameters.splice(index, 1, {
            ...updatedParameter});
        }

        this.editId = null;
        this.editedParameter = {};
      } catch (error) {
        console.error("Error updating parameter:", error);
        if (error.message.includes("modified by another user")) {
          alert("This parameter was modified by another user. Please refresh and try again.");
          this.fetchParameters();
        } else {
          alert(`Error updating parameter: ${error.message}`);
        }
      }
    },
    cancelEdit() {
      this.editId = null;
      this.editedParameter = {};
    },
    async deleteParameter(id) {
        try {
          const response = await apiFetch(`/${id}`, { method: "DELETE" });

          if (response === null) {
            this.parameters = this.parameters.filter(parameter => parameter.id !== id);
          } else {
            throw new Error("Failed to delete the parameter");
          }
        } catch (error) {
          console.error("Error deleting parameter:", error);
          alert(`Error deleting parameter: ${error.message}`);
        }
    },

    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    closeDropdown() {
      if (this.isDropdownVisible) {
        this.isDropdownVisible = false;
      }
    },
    logout() {
      localStorage.removeItem("authToken");
      this.$router.push({ name: "SignIn" });
    },
    turkey(){
      this.code = "TR";
      this.closeDropdown();
      this.fetchParameters();
    },
    other(){
      this.code = "UK";
      this.closeDropdown();
      this.fetchParameters();
    },
    sortElements(){
      this.sort = this.sort === 'DESC' ? 'ASC' : 'DESC';
      this.fetchParameters();
    }

  },
};
</script>

<style src="@/styles/components/HomePage.css"></style>
<style src="@/styles/styles.css"></style>
