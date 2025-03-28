<script lang="ts">
  import {Card, Heading} from "flowbite-svelte";
</script>

<div class="container mx-auto py-12 px-4 z-10">
  <div class="flex flex-col">
    <div class="flex justify-around">
      <div class="w-8/12 flex flex-col gap-3">
        <h1 class="text-5xl text-orange-600">
          SMART PALMS (PARCEL ACCEPTANCE LOCKER MANAGEMENT SYSTEM)
        </h1>
        <p class="text-orange-800 text-3xl font-bold">
          WHERE SECURITY MEETS CONVENIENCE
        </p>
        <p class="text-lg">
          SMART PALMS is an innovative smart parcel locker management system
          designed to streamline package handling in residential and
          high-density areas such as condominiums, apartment complexes,
          dormitories, etc. It offers a secure, efficient, and organized
          solution for managing deliveries, ensuring convenience for both
          recipients and couriers. By integrating advanced technology and a
          structured approach to parcel management, SMART PALMS addresses common
          delivery challenges, enhancing security, accessibility, and overall
          user experience.
        </p>
      </div>
      <img src="/box.png" class="w-4/12" />
    </div>
    <div class="flex gap-3 mb-10">
      <div class="flex">
        <div class="bg-orange-500 aspect-square mr-3 h-14 rounded-full"></div>
        <div class="flex flex-col">
          <p class="text-lg font-bold">Enhanced Safety Features</p>
          <p class="text-sm">
            Durable steel lockers compartments, equipped with UV-C technology
            for safety and sanitation of parcels
          </p>
        </div>
      </div>
      <div class="flex">
        <div class="bg-orange-500 aspect-square mr-3 h-14 rounded-full"></div>
        <div class="flex flex-col">
          <p class="text-lg font-bold">Improved Security Measures</p>
          <p class="text-sm">SMART PALMS features a solenoid and OTP-based locking mechanism, paired with a CCTV Camera for security surveillance
          </p>
        </div>
      </div>
      <div class="flex">
        <div class="bg-orange-500 aspect-square mr-3 h-14 rounded-full"></div>
        <div class="flex flex-col">
          <p class="text-lg font-bold">Convenient Locker Management System</p>
          <p class="text-sm">A user-friendly website with digital payment for simplified transactions and improved management.
          </p>
        </div>
      </div>
      <div class="flex">
        <div class="bg-orange-500 aspect-square mr-3 h-14 rounded-full"></div>
        <div class="flex flex-col">
          <p class="text-lg font-bold">Affordable Locker Subscription Plans</p>
          <p class="text-sm">Affordable locker subscription fees with varying locker sizes of your choice and preferred rent duration
          </p>
        </div>
      </div>
    </div>
    <div class="bg-orange-200 w-full rounded-2xl p-6 shadow-lg">Contact Us: support@smartpalms.com</div>
  </div>
</div>

<style>
  h1 {
    line-height: 1;
  }
</style>
