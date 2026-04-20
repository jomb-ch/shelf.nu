import { useEffect } from "react";
import type { Location } from "@prisma/client";
import { useAtom, useAtomValue } from "jotai";
import { useActionData } from "react-router";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { updateDynamicTitleAtom } from "~/atoms/dynamic-title-atom";
import { fileErrorAtom, defaultValidateFileAtom } from "~/atoms/file";
import { useDisabled } from "~/hooks/use-disabled";
import useFetcherWithReset from "~/hooks/use-fetcher-with-reset";
import type { action as editLocationAction } from "~/routes/_layout+/locations.$locationId_.edit";
import type { action as newLocationAction } from "~/routes/_layout+/locations.new";
import { ACCEPT_SUPPORTED_IMAGES } from "~/utils/constants";
import { tw } from "~/utils/tw";
import { zodFieldIsRequired } from "~/utils/zod";
import { LocationSelect } from "./location-select";
import { Form } from "../custom-form";
import FormRow from "../forms/form-row";
import Input from "../forms/input";
import { RefererRedirectInput } from "../forms/referer-redirect-input";
import { AbsolutePositionedHeaderActions } from "../layout/header/absolute-positioned-header-actions";
import { Button } from "../shared/button";
import { ButtonGroup } from "../shared/button-group";
import { Card } from "../shared/card";
import { Spinner } from "../shared/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shared/tooltip";
import When from "../when/when";

export const NewLocationFormSchema = z.object({
  name: z.string().min(2, "Name ist erforderlich"),
  description: z.string(),
  address: z.string(),
  parentId: z
    .string()
    .optional()
    .transform((value) => (value ? value : null)),
  addAnother: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  preventRedirect: z.string().optional(),
  redirectTo: z.string().optional(),
});

type NewLocationPayload = Pick<Location, "id" | "name"> & {
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  parentId?: Location["parentId"];
};

interface Props {
  className?: string;
  name?: Location["name"];
  address?: Location["address"];
  description?: Location["description"];
  apiUrl?: string;
  /** Callback function to handle cancel action when form is used inline (e.g., in a dialog). When provided, Cancel button will call this instead of navigating. */
  onCancel?: () => void;
  /** Callback function triggered on successful location creation/update */
  onSuccess?: (data?: { location?: NewLocationPayload }) => void;
  parentId?: Location["parentId"];
  referer?: string | null;
  excludeLocationId?: Location["id"];
}

export const LocationForm = ({
  className,
  name,
  address,
  description,
  apiUrl,
  onSuccess,
  parentId,
  referer,
  excludeLocationId,
  onCancel,
}: Props) => {
  const zo = useZorm("NewQuestionWizardScreen", NewLocationFormSchema);
  const fetcher = useFetcherWithReset<{
    success?: boolean;
    location?: NewLocationPayload;
    error?: { message?: string; additionalData?: { field?: string } };
    errors?: Record<string, { message?: string }>;
  }>();
  const fetcherData = fetcher.data;
  const hasOnSuccessFunc = typeof onSuccess === "function";
  const disabled = useDisabled(hasOnSuccessFunc ? fetcher : undefined);

  const actionData = useActionData<
    typeof newLocationAction | typeof editLocationAction
  >();
  const fileError = useAtomValue(fileErrorAtom);
  const [, validateFile] = useAtom(defaultValidateFileAtom);
  const [, updateName] = useAtom(updateDynamicTitleAtom);

  useEffect(() => {
    if (!hasOnSuccessFunc) return;

    if (fetcherData?.success) {
      onSuccess(fetcherData);
      fetcher.reset();
    }
  }, [fetcher, fetcherData, hasOnSuccessFunc, onSuccess]);

  const imageError =
    (hasOnSuccessFunc
      ? fetcherData?.errors?.image?.message ??
        (fetcherData?.error?.additionalData?.field === "image"
          ? fetcherData?.error?.message
          : undefined)
      : undefined) ??
    (actionData as any)?.errors?.image?.message ??
    ((actionData as any)?.error?.additionalData?.field === "image"
      ? (actionData as any)?.error?.message
      : undefined) ??
    fileError;

  const nameError =
    (hasOnSuccessFunc
      ? fetcherData?.error?.message || fetcherData?.errors?.name?.message
      : (actionData as any)?.error?.message ||
        (actionData as any)?.errors?.name?.message) ||
    zo.errors.name()?.message;

  const FormComponent = hasOnSuccessFunc ? fetcher.Form : Form;

  return (
    <Card
      className={tw(
        "w-full max-w-full md:w-min",
        hasOnSuccessFunc ? "border-none  shadow-none" : "",
        className
      )}
    >
      <FormComponent
        ref={zo.ref}
        method="post"
        className="flex w-full max-w-full flex-col gap-2"
        encType="multipart/form-data"
        action={apiUrl}
      >
        <RefererRedirectInput
          fieldName={zo.fields.redirectTo()}
          referer={referer}
        />

        {hasOnSuccessFunc ? null : (
          <AbsolutePositionedHeaderActions className="hidden md:flex">
            <Actions
              disabled={disabled}
              referer={referer}
              onCancel={onCancel}
            />
          </AbsolutePositionedHeaderActions>
        )}

        <When
          truthy={hasOnSuccessFunc}
          fallback={
            <FormRow
              rowLabel={"Name"}
              className="border-b-0 pb-[10px] pt-0"
              required={zodFieldIsRequired(NewLocationFormSchema.shape.name)}
            >
              <Input
                label="Name"
                hideLabel
                name={zo.fields.name()}
                disabled={disabled}
                error={nameError}
                autoFocus
                data-dialog-initial-focus
                onChange={hasOnSuccessFunc ? undefined : updateName}
                className="w-full"
                defaultValue={name || undefined}
                placeholder="Lagerraum"
                required={zodFieldIsRequired(NewLocationFormSchema.shape.name)}
              />
            </FormRow>
          }
        >
          <Input
            label="Name"
            hideLabel
            name={zo.fields.name()}
            disabled={disabled}
            error={nameError}
            autoFocus
            data-dialog-initial-focus
            onChange={hasOnSuccessFunc ? undefined : updateName}
            className="w-full"
            defaultValue={name || undefined}
            placeholder="Lagerraum"
            required={zodFieldIsRequired(NewLocationFormSchema.shape.name)}
          />
        </When>

        <FormRow
          rowLabel={"Übergeordneter Standort"}
          subHeading={
            <p>
              Optional. Ordnen Sie diesen Standort einem bestehenden Standort
              unter, um Breadcrumbs aufzubauen.
            </p>
          }
        >
          <div className="mb-2 block lg:hidden">
            <div className="text-sm font-medium text-gray-700">
              Übergeordneter Standort
            </div>
            <p className="text-xs text-gray-600">
              Optional. Ordnen Sie diesen Standort einem bestehenden Standort
              unter, um Breadcrumbs aufzubauen.
            </p>
          </div>
          <LocationSelect
            isBulk={false}
            className="w-full max-w-full"
            popoverZIndexClassName={hasOnSuccessFunc ? "z-[10000]" : undefined}
            hideExtraContent={hasOnSuccessFunc}
            fieldName={zo.fields.parentId()}
            placeholder="Kein übergeordneter Standort"
            defaultValue={parentId ?? undefined}
            hideCurrentLocationInput
            excludeIds={excludeLocationId ? [excludeLocationId] : undefined}
          />
        </FormRow>

        <When
          truthy={hasOnSuccessFunc}
          fallback={
            <FormRow rowLabel={"Hauptbild"}>
              <div>
                <p className="hidden lg:block">
                  PNG, JPG oder JPEG erlaubt (max. 4 MB)
                </p>
                <Input
                  disabled={disabled}
                  accept={ACCEPT_SUPPORTED_IMAGES}
                  name="image"
                  type="file"
                  onChange={validateFile}
                  label={"Hauptbild"}
                  hideLabel
                  error={imageError}
                  className="mt-2"
                  inputClassName="border-0 shadow-none p-0 rounded-none"
                />
                <p className="mt-2 lg:hidden">
                  PNG, JPG oder JPEG erlaubt (max. 4 MB)
                </p>
              </div>
            </FormRow>
          }
        >
          <Input
            disabled={disabled}
            accept={ACCEPT_SUPPORTED_IMAGES}
            name="image"
            type="file"
            onChange={validateFile}
            label={"Hauptbild"}
            error={imageError}
            className="mt-2"
            inputClassName="border-0 shadow-none p-0 rounded-none"
          />
          <p className="hidden lg:block">
            PNG, JPG oder JPEG erlaubt (max. 4 MB)
          </p>
        </When>

        <When
          truthy={hasOnSuccessFunc}
          fallback={
            <FormRow
              rowLabel={"Adresse"}
              subHeading={
                <p>
                  Setzt die Geoposition des Standorts anhand der Adresse. Geben
                  Sie eine möglichst genaue Adresse an, damit die Kartenposition
                  so präzise wie möglich ist.
                </p>
              }
              className="pt-[10px]"
              required={zodFieldIsRequired(NewLocationFormSchema.shape.address)}
            >
              <Input
                label="Adresse"
                hideLabel
                name={zo.fields.address()}
                disabled={disabled}
                error={zo.errors.address()?.message}
                className="w-full"
                defaultValue={address || undefined}
                required={zodFieldIsRequired(
                  NewLocationFormSchema.shape.address
                )}
              />
            </FormRow>
          }
        >
          <Input
            label="Adresse"
            name={zo.fields.address()}
            disabled={disabled}
            error={zo.errors.address()?.message}
            className="w-full"
            defaultValue={address || undefined}
            required={zodFieldIsRequired(NewLocationFormSchema.shape.address)}
          />
        </When>

        <When
          truthy={hasOnSuccessFunc}
          fallback={
            <FormRow
              rowLabel="Description"
              subHeading={
                <p>
                  Dies ist die anfängliche Objektbeschreibung. Sie wird auf der
                  Standortseite angezeigt und kann jederzeit geändert werden.
                </p>
              }
              required={zodFieldIsRequired(
                NewLocationFormSchema.shape.description
              )}
            >
              <Input
                inputType="textarea"
                label="Beschreibung"
                hideLabel
                name={zo.fields.description()}
                defaultValue={description || ""}
                placeholder="Beschreibung für Ihren Standort hinzufügen."
                disabled={disabled}
                data-test-id="locationDescription"
                className="w-full"
                required={zodFieldIsRequired(
                  NewLocationFormSchema.shape.description
                )}
              />
            </FormRow>
          }
        >
          <Input
            inputType="textarea"
            label="Beschreibung"
            name={zo.fields.description()}
            defaultValue={description || ""}
            placeholder="Beschreibung für Ihren Standort hinzufügen."
            disabled={disabled}
            data-test-id="locationDescription"
            className="w-full"
            required={zodFieldIsRequired(
              NewLocationFormSchema.shape.description
            )}
          />
        </When>

        {hasOnSuccessFunc ? (
          <input type="hidden" name="preventRedirect" value="true" />
        ) : null}

        <FormRow className="border-y-0 py-2" rowLabel="">
          <div className="ml-auto">
            <Button type="submit" disabled={disabled}>
              {disabled ? <Spinner /> : "Speichern"}
            </Button>
          </div>
        </FormRow>
      </FormComponent>
    </Card>
  );
};

const Actions = ({
  disabled,
  referer,
  onCancel,
}: {
  disabled: boolean;
  referer?: string | null;
  onCancel?: () => void;
}) => (
  <>
    <ButtonGroup>
      {/* When onCancel is provided (inline mode), use onClick instead of navigation */}
      {onCancel ? (
        <Button onClick={onCancel} variant="secondary" disabled={disabled}>
          Abbrechen
        </Button>
      ) : (
        <Button to={referer ?? ".."} variant="secondary" disabled={disabled}>
          Abbrechen
        </Button>
      )}
      <AddAnother disabled={disabled} />
    </ButtonGroup>

    <Button type="submit" disabled={disabled}>
      Speichern
    </Button>
  </>
);

const AddAnother = ({ disabled }: { disabled: boolean }) => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="submit"
          variant="secondary"
          disabled={disabled}
          name="addAnother"
          value="true"
        >
          Weiteren hinzufügen
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-sm">
          Standort speichern und direkt einen neuen anlegen
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
