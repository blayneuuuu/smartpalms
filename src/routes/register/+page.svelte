<script lang="ts">
  import {goto} from "$app/navigation";
  import {Card, Button, Label, Input} from "flowbite-svelte";

  let error = "";
  let formData = {
    email: "",
    password: "",
    fullname: "",
    address: "",
    type: "user",
  };

  function handleSubmit() {
    error = "";
    console.log(formData);

    if (
      !formData.email ||
      !formData.password ||
      !formData.fullname ||
      !formData.address
    ) {
      error = "Please fill all the fields";
      return;
    }

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors){
            console.log(data.errors[0].message);
        }
      })
      .catch((err) => {
        console.error(err);
        error = "Something went wrong";
      });

  }
</script>

<div
  class="flex items-center justify-center min-h-screen bg-gray-100 text-black"
>
  <Card class="w-1/2 min-w-xl space-y-10">
    <h3 class="text-xl font-medium text-gray-900 mx-auto">
      Register as a User
    </h3>
    <form class="grid grid-cols-2 gap-4 w-full">
      <Label class="space-y-2">
        <span>Email</span>
        <Input
          class="text-black"
          type="email"
          placeholder="name@company.com"
          bind:value={formData.email}
          required
        />
      </Label>

      <Label class="space-y-2">
        <span>Full Name</span>
        <Input
          type="text"
          placeholder="John Doe"
          bind:value={formData.fullname}
          required
        />
      </Label>

      <Label class="space-y-2">
        <span>Password</span>
        <Input
          type="password"
          placeholder="•••••"
          bind:value={formData.password}
          required
        />
      </Label>

      <Label class="space-y-2">
        <span>Unit No. / Address</span>
        <Input
          type="text"
          placeholder="39A High Street"
          bind:value={formData.address}
          required
        />
      </Label>
    </form>

    {#if error}
      <p class="text-red-500">{error}</p>
    {/if}
    <Button
      class="w-1/2 bg-gray-600 mx-auto rounded-md text-white py-2"
      on:click={handleSubmit}>Register</Button
    >
    <span class=" text-center"
      >already have an account? <a href="/" class="text-blue-500">Login</a
      ></span
    >
  </Card>
</div>
