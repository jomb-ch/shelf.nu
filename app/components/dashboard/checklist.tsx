import { Link, useFetcher, useLoaderData } from "react-router";
import type { loader } from "~/routes/_layout+/dashboard";
import { tw } from "~/utils/tw";
import {
  AddUserIcon,
  AssetsIcon,
  CategoriesIcon,
  CheckmarkIcon,
  CustomFiedIcon,
  TagsIcon,
  UserIcon,
} from "../icons/library";
import { Button } from "../shared/button";
import Heading from "../shared/heading";
import SubHeading from "../shared/sub-heading";

export default function OnboardingChecklist() {
  const fetcher = useFetcher();
  const { checklistOptions } = useLoaderData<typeof loader>();

  return (
    <div className="mt-6 rounded border bg-white px-4 py-5 lg:px-20 lg:py-16">
      <div className="mb-8">
        <Heading
          as="h2"
          className="break-all text-display-xs font-semibold md:text-display-sm"
        >
          Willkommen
        </Heading>
        <SubHeading>
          Erledigen Sie alle Aufgaben, um Ihr Dashboard freizuschalten.
        </SubHeading>
      </div>
      <div className="mb-8">
        <div className="mb-4">
          <h4 className=" text-lg font-semibold">Bleiben Sie organisiert</h4>
          <p className="text-[14px] text-gray-600">
            Eine saubere Organisation Ihrer Assets verbessert die Übersicht und
            nutzt die Stärke unserer Filter und Suchleiste voll aus.
          </p>
        </div>
        <ul className="onboarding-checklist -mx-1 xl:flex xl:flex-wrap">
          <li
            className={tw(
              " mx-1 mb-2 xl:w-[49%]",
              checklistOptions.hasAssets && "completed"
            )}
          >
            <div className="flex h-full items-start justify-between gap-1 rounded border p-4">
              <div className="flex items-start">
                <div className="mr-3 inline-flex items-center justify-center rounded-full border-[5px] border-solid border-primary-50 bg-primary-100 p-1.5 text-primary">
                  <AssetsIcon />
                </div>
                <div className="text-[14px]">
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-700">
                      Erstellen Sie Ihr erstes Asset
                    </h6>
                    <p className=" text-gray-600">
                      Jedes Asset erhält seinen eigenen verschlüsselten QR-Tag.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to="https://www.shelf.nu/knowledge-base/adding-new-assets"
                      target="_blank"
                      className=" font-semibold text-gray-600"
                    >
                      Mehr erfahren
                    </Link>
                    <Button variant="link" to="/assets/new">
                      Neues Asset
                    </Button>
                  </div>
                </div>
              </div>
              <i className="hidden text-primary">
                <CheckmarkIcon />
              </i>
            </div>
          </li>
          <li
            className={tw(
              " mx-1 mb-2 xl:w-[49%]",
              checklistOptions.hasCategories && "completed"
            )}
          >
            <div className="flex h-full items-start justify-between gap-1 rounded border p-4">
              <div className="flex items-start">
                <div className="mr-3 inline-flex items-center justify-center rounded-full border-[5px] border-solid border-primary-50 bg-primary-100 p-1.5 text-primary">
                  <CategoriesIcon />
                </div>
                <div className="text-[14px]">
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-700">
                      Erstellen Sie eine eigene Kategorie
                    </h6>
                    <p className=" text-gray-600">
                      Sehen, bearbeiten oder löschen Sie Standardkategorien und
                      erstellen Sie Ihre eigenen.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to="https://www.shelf.nu/knowledge-base/using-categories-to-organize-your-asset-inventory"
                      target="_blank"
                      className=" font-semibold text-gray-600"
                    >
                      Mehr erfahren
                    </Link>
                    <Button variant="link" to="/categories/new">
                      Neue Kategorie
                    </Button>
                  </div>
                </div>
              </div>
              <i className="hidden text-primary">
                <CheckmarkIcon />
              </i>
            </div>
          </li>
          <li
            className={tw(
              " mx-1 mb-2 xl:w-[49%]",
              checklistOptions.hasTags && "completed"
            )}
          >
            <div className="flex h-full items-start justify-between gap-1 rounded border p-4">
              <div className="flex items-start">
                <div className="mr-3 inline-flex items-center justify-center rounded-full border-[5px] border-solid border-primary-50 bg-primary-100 p-1.5 text-primary">
                  <TagsIcon />
                </div>
                <div className="text-[14px]">
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-700">
                      Erstellen Sie einen Tag
                    </h6>
                    <p className=" text-gray-600">
                      Tags sind kleine Informationseinheiten, die Assets
                      hinzugefügt werden können.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="link" to="/tags/new">
                      Neuer Tag
                    </Button>
                  </div>
                </div>
              </div>
              <i className="hidden text-primary">
                <CheckmarkIcon />
              </i>
            </div>
          </li>
        </ul>
      </div>
      <div className="mb-8">
        <div className="mb-4">
          <h4 className=" text-lg font-semibold">
            Team, Verwahrung und Buchungen
          </h4>
          <p className="text-[14px] text-gray-600">
            Weisen Sie Ihren Teammitgliedern Verwahrung zu. Erwägen Sie ein
            Upgrade auf Team, um weitere Benutzer in Ihren Arbeitsbereich
            einzuladen.
          </p>
        </div>
        <ul className="onboarding-checklist -mx-1 xl:flex xl:flex-wrap">
          <li
            className={tw(
              " mx-1 mb-2 xl:w-[49%]",
              checklistOptions.hasTeamMembers && "completed"
            )}
          >
            <div className="flex h-full items-start justify-between gap-1 rounded border p-4">
              <div className="flex items-start">
                <div className="mr-3 inline-flex items-center justify-center rounded-full border-[5px] border-solid border-primary-50 bg-primary-100 p-1.5 text-primary">
                  <UserIcon />
                </div>
                <div className="text-[14px]">
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-700">
                      Fügen Sie ein Teammitglied hinzu
                    </h6>
                    <p className=" text-gray-600">
                      Verfolgen Sie, wer ein Asset in Verwahrung hat, indem Sie
                      Ihre Teammitglieder in Shelf hinzufügen.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to="https://www.shelf.nu/knowledge-base/onboarding-your-team-members"
                      target="_blank"
                      className=" font-semibold text-gray-600"
                    >
                      Mehr erfahren
                    </Link>
                    <Button variant="link" to="/settings/team">
                      Neues Teammitglied
                    </Button>
                  </div>
                </div>
              </div>
              <i className="hidden text-primary">
                <CheckmarkIcon />
              </i>
            </div>
          </li>
          <li
            className={tw(
              " mx-1 mb-2 xl:w-[49%]",
              checklistOptions.hasCustodies && "completed"
            )}
          >
            <div className="flex h-full items-start justify-between gap-1 rounded border p-4">
              <div className="flex items-start">
                <div className="mr-3 inline-flex items-center justify-center rounded-full border-[5px] border-solid border-primary-50 bg-primary-100 p-1.5 text-primary">
                  <AddUserIcon />
                </div>
                <div className="text-[14px]">
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-700">
                      Weisen Sie Verwahrung für ein Asset zu
                    </h6>
                    <p className=" text-gray-600">
                      Verfolgen und organisieren Sie langfristige Ausleihen,
                      indem Sie Assets verantwortlichen Personen zuweisen.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to="https://www.shelf.nu/knowledge-base/custody-feature-for-long-term-equipment-lend-outs"
                      target="_blank"
                      className=" font-semibold text-gray-600"
                    >
                      Mehr erfahren
                    </Link>
                  </div>
                </div>
              </div>
              <i className="hidden text-primary">
                <CheckmarkIcon />
              </i>
            </div>
          </li>
        </ul>
      </div>
      <div className="mb-8">
        <div className="mb-4">
          <h4 className=" text-lg font-semibold">Passen Sie Ihr Erlebnis an</h4>
          <p className="text-[14px] text-gray-600">
            Optimieren Sie Ihre Abläufe und nutzen Sie Shelf so, wie es für Sie
            und Ihre Organisationen passt.
          </p>
        </div>
        <ul className="onboarding-checklist -mx-1 xl:flex xl:flex-wrap">
          <li
            className={tw(
              " mx-1 mb-2 xl:w-[49%]",
              checklistOptions.hasCustomFields && "completed"
            )}
          >
            <div className="flex h-full items-start justify-between gap-1 rounded border p-4">
              <div className="flex items-start">
                <div className="mr-3 inline-flex items-center justify-center rounded-full border-[5px] border-solid border-primary-50 bg-primary-100 p-1.5 text-primary">
                  <CustomFiedIcon />
                </div>
                <div className="text-[14px]">
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-700">
                      Erstellen Sie ein benutzerdefiniertes Feld
                    </h6>
                    <p className=" text-gray-600">
                      Erweitern Sie Ihre Asset-Datenbank mit zusätzlichen
                      Feldtypen.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to="https://www.shelf.nu/knowledge-base/adding-additional-fields-to-assets"
                      target="_blank"
                      className=" font-semibold text-gray-600"
                    >
                      Mehr erfahren
                    </Link>
                    <Button variant="link" to="/settings/custom-fields/new">
                      Neues benutzerdefiniertes Feld
                    </Button>
                  </div>
                </div>
              </div>
              <i className="hidden text-primary">
                <CheckmarkIcon />
              </i>
            </div>
          </li>
        </ul>
      </div>
      <fetcher.Form
        method="post"
        action="/api/user/prefs/skip-onboarding-checklist"
      >
        <input type="hidden" name="skipOnboardingChecklist" value="skipped" />
        <Button variant="link" type="submit">
          Tour überspringen, weiter zum Dashboard
        </Button>
      </fetcher.Form>
    </div>
  );
}
