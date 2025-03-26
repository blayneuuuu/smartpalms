<script lang="ts">
  import { Card, Heading } from 'flowbite-svelte';
</script>

<div class="container mx-auto py-12 px-4">
  <div class="max-w-4xl mx-auto">
    <Heading tag="h1" class="mb-8 text-center">About SmartPalms</Heading>
    
    <Card class="mb-8">
      <div class="prose max-w-none">
        <h2 class="text-2xl font-bold mb-4">Our Mission</h2>
        <p class="mb-4">
          At SmartPalms, we're dedicated to revolutionizing how people access and use storage solutions. 
          Our smart locker system provides secure, convenient, and efficient storage for all your needs. 
          Whether you're a student storing books between classes, a traveler safeguarding valuables, 
          or a business offering secure package pickup, SmartPalms is the solution you've been looking for.
        </p>
        <p>
          We believe in combining cutting-edge technology with user-friendly design to create a 
          seamless experience that makes life simpler.
        </p>
      </div>
    </Card>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <h2 class="text-xl font-bold mb-4">How It Works</h2>
        <ol class="list-decimal pl-5 space-y-2">
          <li><span class="font-medium">Register an account</span> - Create your SmartPalms account in minutes</li>
          <li><span class="font-medium">Select a locker</span> - Choose from various sizes based on your needs</li>
          <li><span class="font-medium">Complete payment</span> - Pay for your selected subscription plan</li>
          <li><span class="font-medium">Access anytime</span> - Use OTP codes to access your locker whenever you need</li>
        </ol>
      </Card>
      
      <Card>
        <h2 class="text-xl font-bold mb-4">Our Features</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li><span class="font-medium">24/7 Accessibility</span> - Access your belongings any time, day or night</li>
          <li><span class="font-medium">Bank-level Security</span> - Advanced locking mechanisms and monitoring</li>
          <li><span class="font-medium">Multiple Locker Sizes</span> - Small, medium, and large options available</li>
          <li><span class="font-medium">Flexible Subscriptions</span> - Choose daily, weekly, or monthly plans</li>
          <li><span class="font-medium">Mobile Access</span> - Generate OTP codes from your smartphone</li>
        </ul>
      </Card>
    </div>
    
    <Card>
      <h2 class="text-2xl font-bold mb-4">Contact Us</h2>
      <p class="mb-4">
        Have questions about SmartPalms? We're here to help! Reach out to our customer support team:
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="font-medium">Email:</p>
          <p class="text-blue-600">support@smartpalms.com</p>
        </div>
        <div>
          <p class="font-medium">Phone:</p>
          <p>(123) 456-7890</p>
        </div>
        <div>
          <p class="font-medium">Hours:</p>
          <p>Monday - Friday: 9AM - 5PM</p>
        </div>
        <div>
          <p class="font-medium">Address:</p>
          <p>123 Smart Street, Tech City</p>
        </div>
      </div>
    </Card>
  </div>
</div> 