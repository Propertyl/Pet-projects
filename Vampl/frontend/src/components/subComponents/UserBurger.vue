<script setup lang="ts">
import useUserData from '../../store/userData';
defineProps({
  isOpen:Boolean
});

  const userData = useUserData();

</script>

<template>
  <section :class="{appear:isOpen,disappear:!isOpen}" class="user-burger-menu">
    <div class="container">
       {{ userData.additionalData }}
    </div>
  </section>
</template>

<style scoped>
  .user-burger-menu {
    position: relative;
    display: flex;
    width: 20rem;
    height: 100%;
    background-color: var(--bg-main);
    transition: all .2s;
    animation: open-menu .3s ease-out forwards;
  }

  @keyframes open-menu {
    from {
      transform: translateX(-100%);
    } to {
      transform: translateX(0%);
    }
  }
</style>