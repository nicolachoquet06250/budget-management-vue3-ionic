<template>
  <ion-app>
    <ion-content>
      <router-view id="main"> </router-view>

      <Sidebar />

      <UpdateSoldModal />

      <ion-toast
        :is-open="toast.opened"
        :message="toast.message"
        :duration="toast.duration"
      ></ion-toast>
    </ion-content>
  </ion-app>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import UpdateSoldModal from '@/components/UpdateSoldModal.vue';
import { useToast, useTheme/*, useDataBase*/ } from "@/hooks";

const { bgPrimary, colorPrimary, bgSecondary, colorSecondary } = useTheme();
const { toast } = useToast();
//const { getDB, line, get, startBy, numberBetweenIncluded, greaterThan } = useDataBase('software');

/*(async () => {
    await getDB({
        id: 'number',
        name: 'string',
        version: 'number'
    });

    await line({
        id: 0,
        name: 'Logiciel 1',
        version: 1
    });

    await line({
        id: 1,
        name: 'Logiciel 1',
        version: 2
    });

    console.log('id: 1', await get({
        id: 1
    }));

    console.log('name start by "Logiciel "', await get({
        id: 0,
        name: startBy('Logiciel ')
    }));

    console.log('version between include 1 and 2', await get({
        version: numberBetweenIncluded(1, 2)
    }));

    console.log('version greater than 0', await get({
      version: greaterThan(0)
    }));
})();*/

</script>

<style lang="scss" scoped>
.dark {
  ion-toolbar {
    --ion-color-md-primary: v-bind(bgPrimary[true]);
    --ion-color-primary: v-bind(bgPrimary[true]);

    --ion-color-md-primary-contrast: v-bind(colorPrimary[true]);
    --ion-color-primary-contrast: v-bind(colorPrimary[true]);

    --ion-text-color: v-bind(colorPrimary[true]);
    --ion-text-md-color: v-bind(colorPrimary[true]);

    --ion-background-md-color: v-bind(bgPrimary[true]);
    --ion-background-color: v-bind(bgPrimary[true]);
  }

  ion-content {
    --ion-color-md-primary: v-bind(bgSecondary[true]);
    --ion-color-primary: v-bind(bgSecondary[true]);

    --ion-color-md-primary-contrast: v-bind(colorSecondary[true]);
    --ion-color-primary-contrast: v-bind(colorSecondary[true]);

    --ion-text-color: v-bind(colorSecondary[true]);
    --ion-text-md-color: v-bind(colorSecondary[true]);

    --ion-background-md-color: v-bind(bgSecondary[true]);
    --ion-background-color: v-bind(bgSecondary[true]);
  }
}

ion {
  &-toolbar {
    --ion-color-md-primary: v-bind(bgPrimary[false]);
    --ion-color-primary: v-bind(bgPrimary[false]);

    --ion-color-md-primary-contrast: v-bind(colorPrimary[false]);
    --ion-color-primary-contrast: v-bind(colorPrimary[false]);

    --ion-text-color: v-bind(colorPrimary[false]);
    --ion-text-md-color: v-bind(colorPrimary[false]);

    --ion-background-md-color: v-bind(bgPrimary[false]);
    --ion-background-color: v-bind(bgPrimary[false]);
  }

  &-content {
    --ion-color-md-primary: v-bind(bgSecondary[false]);
    --ion-color-primary: v-bind(bgSecondary[false]);

    --ion-color-md-primary-contrast: v-bind(colorSecondary[false]);
    --ion-color-primary-contrast: v-bind(colorSecondary[false]);

    --ion-text-color: v-bind(colorSecondary[false]);
    --ion-text-md-color: v-bind(colorSecondary[false]);

    --ion-background-md-color: v-bind(bgSecondary[false]);
    --ion-background-color: v-bind(bgSecondary[false]);
  }
}
</style>
