<script setup lang="ts">
import { Avatar, Card, Input, Table, Tag, Tooltip } from "ant-design-vue";
import { onMounted, ref, watch } from "vue";
import Contact from "./components/Contact/Contact.vue";
import { getLeads, getContactByUrl, getUserById } from "./api/api";
import { TContact, TLead, TTableData, TUser } from "./types";
import {
  SearchOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
//@ts-ignore
import debounce from "lodash.debounce";

const data = ref<TTableData[] | null>(null);

const leadsMap = ref<Map<string | number, TLead> | null>(null);
const contactsMap = ref<Map<string | number, TContact> | null>(null);

const leads = ref<TLead[] | null>(null);
const usersMap = ref<Map<string | number, TUser> | null>(null);

const loading = ref(false);
const error = ref(false);

const searchParam = ref("");

const columns = [
  {
    name: "Название",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Бюджет",
    dataIndex: "budget",
    key: "budget",
  },
  {
    title: "Статус",
    key: "status",
    dataIndex: "status",
  },
  {
    title: "Ответственный",
    key: "responsible",
    dataIndex: "responsible",
  },
  {
    title: "Дата создания",
    key: "date",
    dataIndex: "date",
  },
];

onMounted(async () => {
  loading.value = true;
  leads.value = await getLeads();
  await initializeApp(leads.value);
  loading.value = false;
});

const initializeApp = async (leads: TLead[]) => {
  leadsMap.value = arrayToMap(leads);

  const contacts = await fetchContacts(leads);
  contactsMap.value = arrayToMap(contacts);

  const users = await fetchResponsible(leads);
  usersMap.value = arrayToMap(users);

  data.value = formatTableData(leads, contactsMap.value, usersMap.value);
};

const formatDate = (time: number) => {
  let t = new Date(time * 1000);

  let mounth =
    t.getMonth() + 1 < 10 ? "0" + (t.getMonth() + 1) : t.getMonth() + 1;
  let day = t.getDay() < 10 ? "0" + t.getDay() : t.getDay();
  let hours = t.getHours() < 10 ? "0" + t.getHours() : t.getHours();
  let minutes = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
  let year = t.getFullYear();
  return `${day}.${mounth}.${year} ${hours}:${minutes}`;
};

const formatTableData = (
  leadItems: TLead[],
  contactItems: Map<string | number, TContact>,
  usersMap: Map<string | number, TUser>
) => {
  return leadItems.reduce((prev, curr) => {
    prev.push({
      key: curr.id,
      name: curr.name,
      budget: curr.price,
      status: ["Не понял как получить 😔"],
      date: formatDate(curr.created_at),
      responsible: attachResposible(curr, usersMap),
      description: attachContacts(curr, contactItems),
    });

    return prev;
  }, [] as TTableData[]);
};

const arrayToMap = <T extends { id: string | number }>(arr: T[]) => {
  return new Map(arr.map((elem) => [elem.id, elem]));
};

const fetchContacts = async (leadItems: TLead[]) => {
  let promises = leadItems.map((elem) =>
    elem._embedded.contacts.map((elem) =>
      getContactByUrl(elem._links.self.href)
    )
  );
  let contacts = await Promise.all(promises.flat());
  return contacts;
};

const fetchResponsible = async (leadItems: TLead[]) => {
  let promises = leadItems.map((elem) => getUserById(elem.responsible_user_id));
  let contacts = await Promise.all(promises.flat());
  return contacts;
};

const attachContacts = (
  lead: TLead,
  contacts: Map<string | number, TContact>
) => {
  return lead._embedded.contacts
    .map(({ id }) => contacts.get(id))
    .filter((contact) => contact?.first_name);
};

const attachResposible = (lead: TLead, users: Map<string | number, TUser>) => {
  return users.get(lead.responsible_user_id)?.name;
};

watch(
  () => searchParam.value,
  debounce(async () => {
    loading.value = true;

    if (searchParam.value !== "" && searchParam.value.length < 3) {
      error.value = true;
      return;
    }
    error.value = false;
    leads.value = await getLeads(`query=${searchParam.value}`);
    console.log(leads.value);
    
    await initializeApp(leads.value);

    loading.value = false;
  }, 1000)
);

</script>

<template>
    <div class="container">
      <Card title="Тестовое задание" class="card">
        <template #extra>
          <div style="display: flex; align-items: center; gap: 15px">
            <Tooltip v-if="error" placement="top">
              <template #title>
                <span>Поиск работает от 3-х символов</span>
              </template>
              <span><WarningOutlined style="color: rgb(255, 168, 69)" /></span>
            </Tooltip>
            <Input
              type="text"
              v-model:value="searchParam"
              placeholder="Найти..."
            >
              <template #suffix>
                <SearchOutlined style="color: rgb(158, 156, 156)" />
              </template>
            </Input>
          </div>
        </template>
        <Table
          :loading="loading"
          :columns="columns"
          :data-source="data!"
          :pagination="false"
        >
          <template #headerCell="{ column }">
            <span v-if="column.key === 'name'" style="font-weight: 600">
              Название
            </span>
          </template>
          <template #expandedRowRender="{ record }: { record: TTableData }">
            <p v-if="!record.description?.length" style="margin: 0">
              Нет контактов
            </p>
            <p
              style="
                margin: 0;
                margin-bottom: 10px;
                display: flex;
                gap: 10px;
                align-items: center;
              "
              v-for="description in record.description"
            >
              <Avatar
                style="margin-right: 5px; background-color: rgb(199, 199, 206)"
                ><UserOutlined /></Avatar
              ><span>{{ description?.name }}</span>
              <span
                style="display: flex; gap: 5px"
                v-for="contact in description?.custom_fields_values"
              >
                <Contact
                  v-for="contactInfo in contact.values"
                  :type="contact.field_code"
                  :data="contactInfo.value"
                />
              </span>
            </p>
          </template>
          <template class="bodyCell" #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <span>
                {{ record.name }}
              </span>
            </template>
            <template v-else-if="column.key === 'status'">
              <span>
                <Tag
                  v-for="status in record.status"
                  :key="status"
                  :color="
                    status === 'loser'
                      ? 'volcano'
                      : status.length > 5
                      ? 'geekblue'
                      : 'green'
                  "
                >
                  {{ status.toUpperCase() }}
                </Tag>
              </span>
            </template>
            <template v-else-if="column.key === 'responsible'">
              <span>
                <Avatar
                  style="
                    margin-right: 5px;
                    background-color: rgb(210, 210, 252);
                  "
                  ><UserOutlined
                /></Avatar>
                {{ record.responsible }}
              </span>
            </template>
            <template v-else-if="column.key === 'date'">
              <span>
                {{ record.date }}
              </span>
            </template>
          </template>
        </Table>
      </Card>
    </div>
</template>

