<template>
    <nav  v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-3">
    <div v-if="page > 1" class="-mt-px flex w-0 flex-1">
      <a href="#" @click.stop.prevent="prev" class="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        <ArrowLongLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        Previous
      </a>
    </div>
    <div v-if="page == 1" class="-mt-px flex w-0 flex-1">
      <a class="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        <ArrowLongLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        Previous
      </a>
    </div>


    <div class="hidden md:-mt-px md:flex">


        <span v-if="page > 4" 
            class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>
        <template v-for="n in totalPages" :key="n">
            <a v-if="(page != n) && Math.abs(page - n) <= 3" 
            @click.stop.prevent="goPage(n)"
            href="#" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >{{ n }}</a>
            
            <a v-if="page == n" class="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600" aria-current="page"
            >{{ n }}</a>
        </template>
        <span v-if="page + 3 < totalPages" 
            class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>

    </div>

    <div v-if="page < totalPages" class="-mt-px flex w-0 flex-1 justify-end">
      <a href="#" @click.stop.prevent="next" class="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Next
        <ArrowLongRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
      </a>
    </div>
    <div v-if="(page == totalPages)" class="-mt-px flex w-0 flex-1 justify-end">
      <a class="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Next
        <ArrowLongRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
      </a>
    </div>

  </nav>

</template>

<script setup lang="ts">
    import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid'

    const emit = defineEmits(['goToPage', 'goPreviousPage', 'goNextPage'])
    defineProps<{ page: number, totalPages: number }>();

    function prev() {
        emit('goPreviousPage')
    }

    function next() {
        emit('goNextPage')
    }

    function goPage(n: number) {
        emit('goToPage', n)
    }

</script>