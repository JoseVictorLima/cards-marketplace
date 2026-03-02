<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { ICard, IService } from 'src/interfaces';
import CardView from 'src/components/card/CardView.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

interface props {
  profileName: string;
  isSessionUser?: boolean;
}

const props = withDefaults(defineProps<props>(), {
  profileName: '',
  isSessionUser: false,
});
const $router = useRouter();
const $services = inject('$services') as IService;
const { t } = useI18n();
const pageUserCards = ref([] as ICard[]);
const isProfileCardsLoading = ref(false);

async function getProfileCards() {
  try {
    if (props.isSessionUser) {
      //Load logged user's cards
      const resp = await $services.me.getSessionUserCards();
      if (resp && resp.length > 0) {
        pageUserCards.value = resp;
      }
    } else {
      //Load profile user's cards
    }
  } catch (error) {
    console.log(error);
  }
}

async function addCard() {
  await $router.push(`/profile/${props.profileName}/add-card`);
}

onMounted(async () => {
  isProfileCardsLoading.value = true;
  await getProfileCards();
  isProfileCardsLoading.value = false;
});
</script>
<template>
  <div class="column justify-center q-px-md q-mx-xl q-pb-sm">
    <div
      :class="`row ${$q.screen.lt.sm ? 'justify-center' : 'justify-between'} q-mb-sm q-gutter-x-sm`"
    >
      <span
        :class="`text-primary q-my-sm ytm-font-lg ${$q.screen.lt.sm ? 'text-center' : 'text-left'}`"
      >
        <b>
          {{ isSessionUser ? t('profile.cards.title_session_user') : t('profile.cards.title') }}
        </b>
      </span>
      <div v-if="isSessionUser" class="row items-center">
        <q-btn
          flat
          color="primary"
          :round="$q.screen.gt.xs ? false : true"
          :rounded="$q.screen.gt.xs ? true : false"
          icon="fa-solid fa-plus"
          :label="$q.screen.gt.xs ? t('profile.cards.add') : ''"
          @click="addCard()"
        >
          <q-tooltip v-if="$q.screen.lt.sm">
            <template v-slot:default>
              <span class="ytm-font-sm"> {{ t('profile.cards.add') }} </span>
            </template>
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isProfileCardsLoading" class="col-grow column justify-center items-center q-my-xl">
      <q-spinner color="secondary" size="50px" />
    </div>
    <!-- Loading -->

    <div v-else class="">
      <div v-if="pageUserCards.length > 0">
        <ul
          :class="`col-xs-12 col-sm-11 row ${$q.screen.lt.sm ? 'justify-center' : 'justify-start'} items-center`"
          style="list-style: none; gap: 0.8rem; padding: 0; margin: 0"
        >
          <li
            :class="`${$q.screen.lt.sm ? 'col-12 row justify-center' : ''}`"
            v-for="card in pageUserCards"
            :key="card.id"
          >
            <card-view :card="card" size="sm" />
          </li>
        </ul>
      </div>

      <div v-else class="col-auto full-height">
        <div class="text-center q-py-md text-grey-7">
          <h3 class="q-mb-sm ytm-font-md">{{ t('profile.cards.no_cards') }}</h3>
          <q-icon name="fa-regular fa-face-frown" size="md" />
        </div>
      </div>
    </div>
  </div>
</template>
