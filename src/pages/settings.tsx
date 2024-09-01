import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LOCAL_STORAGE_KEY } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SettingsFormValues {
  useLocalStorage: boolean;
}

const Settings = () => {
  const { t } = useTranslation("common");
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      useLocalStorage: true,
    },
  });

  useEffect(() => {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedValue !== null) {
      form.setValue("useLocalStorage", JSON.parse(storedValue));
    }
  }, []);

  const onSubmit = (data: SettingsFormValues) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(data.useLocalStorage),
    );
    toast({
      title: t("settings.saved"),
      description: t("settings.saved_description"),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("navigation.settings")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="useLocalStorage"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t("settings.use_local_storage")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={field.value ? "true" : "false"}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="yes" />
                          <Label htmlFor="yes">{t("common.yes")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="no" />
                          <Label htmlFor="no">{t("common.no")}</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">{t("actions.save")}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
