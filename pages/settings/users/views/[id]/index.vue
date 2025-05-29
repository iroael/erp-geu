<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

router.replace(`/settings/users/views/${route.params.id}/profil`)
</script>
