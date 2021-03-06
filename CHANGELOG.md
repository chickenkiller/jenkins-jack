# Change Log
All notable changes to the `jenkins-jack` extension will be documented in this file.

## 1.1.0

Massive update adding UI/Views, additional commands, bug fixes, and additional documentation.

### Features

#### Views

The extensions now comes with UI/Views for interacting with all Jacks. The views can be found in the activity bar on the left hand side of the editor (bow icon):

![Views](images/doc/views.png)

All commands a user can execute via the quickpick command list (`ctrl+shift+j`) can also be executed in the Views via context menu or buttons.

For common use, see [TUTORIAL.md](TUTORIAL.md).

#### Pipeline View

This is a specialized view for managing your local Pipeline scripts in associations with Pipeline jobs discovered on the targeted Jenkins host. Linked jobs can be quickly opened and executed using the appropriate buttons.

![Views](images/doc/pipeline_view.png)

This view also provides the ability to pull job/replay scripts for saving locally and linking to that job.

Job to local script configuration can be found in `settings.json` under `jenkins-jack.pipeline.tree.items`.

> **NOTE**:
> The tree view (currently) will not pull __Multibranch__ or __Org__ level jobs.
> For now the Pipeline Job Tree only works for standard Pipeline jobs. Yes, I am sad too.

#### Pipeline Jack
* __Folder Support__: Pipeline execution now supports Pipelines in folders! The folder path is entered/stored in the local script's json configuration under the `folder` property:
  ```javascript
  // For folder1/folder2/testjob
  // in config .testjob.config.json
  {
     "name": "testjob",
     "params": null,
     "folder": "folder1/folder2"
  }
  ```
* __Persist Jenkinsfile SCM configuration on Remote Job__: Executing a Pipeline script on a remote job with SCM information for using a Jenkinsfile will now silently save that SCM info and restore it after a build has started. Before the change, Pipeline execution would overwrite the job's config, embedding your script into the job and losing any SCM information that existed before.
* __Interactive Build Parameter Input__: When enabled in the settings, during Pipeline execution, the user will be presented with input boxes for each build parameter on the remote job. When disabled, will act as before and utilize build parameter values from the local script's Pipeline config (e.g. `.<myJob>.config.json`).
  > __NOTE__: This option is disabled as default, but can be enabled via `settings.json` under `jenkins-jack.pipeline.params.interactiveInput`.

#### Build Jack

* __Download Replay Scripts__: New command to download build replay scripts to your editor from a targeted Pipeline job and build number.

#### Node Jack

* __Update Labels__: New command to update the label strings on one or more agents.

### Other

* __Add/Delete/Edit Commands for Connections__: You can now manage your host connections through these new commands instead of modifying `settings.json` manually. Add/edit commands will present the user input boxes for the required connection fields.
* __Update Docs__: New docs for use ([TUTORIAL.md](TUTORIAL.md)) and command reference ([COMMANDS.md](COMMANDS.md))

### Fixed

* Fixed "Cannot Connect" message appearing even after a user enters valid Jenkins connection info.
* Fixed broken "jack" commands


## 1.0.1

* __Stream Output to Editor Window__: All output can now be streamed to an editor window instead of the user's Output Channel.

  The output view type can be set in settings via `jenkins-jack.outputView.type` contribution point.

  The default location of the `panel` view type can be set via `jenkins-jack.outputView.panel.defaultViewColumn` contribution point.

### Fixed
* Fixed issue where `Could not connect to the remote Jenkins` message would appear even after puting in correct connection information
* Fixed command `extension.jenkins-jack.jacks` quick pick spacer icon

## 1.0.0

First version. Yip skiddlee dooo!

## 0.1.6

* New [logo](./images/logo.png)

### Fixed
* Shared Library Reference now pulls definitions from any pipelines executed that include a shared lib (e.g. `@Library('shared')`).

## 0.1.6

* __Build Jack:__ Build description now given when showing the list of build numbers to download.

### Fixed
* Most "jacks" can now be invoked (`ctrl+shift+j`) without the need to be in a `groovy` file. Certain jack commands won't display if the view you are editing isn't set to the `groovy` language mode (e.g. Pipeline, Script Console)
* Fixed progress window text formating.

## 0.1.5

* __Job Jack:__ Execute disable, enable, and delete operations on one or more targeted jobs.
* __Node Jack:__ Execute set-online, set-offline, and disconnect operations on one or more targeted nodes.
* __Build Jack:__ Stream syntax higlighted build logs or delete one or more builds from a targeted job.

### Fixed
* Default host connection now populates with default values properly
* Fixed conditional logic for retrieving build numbers via jenkins url

## 0.1.4

* __Multiple Host Connection Support:__ Now supports multiple Jenkins host connections and the ability to swap between hosts (`ctrl+shift+j -> Host Selection`)

    __NOTE:__ Additional hosts are added via `settings.json` which can be found in Settings by typing `Jenkins Jack`.

* __Build Parameter Support for Pipeline Exection:__ Groovy files used for Pipeline execution now support parameters via a config file: `<FILE>.conf.json`. Config file will be created automatically if one doesn't exist for a groovy file.

* __Disabling Strict TLS:__ An option in Settings has been added to disable TLS checks for `https` enpoints that don't have a valid cert.

* __Better Jenkins URI Parsing:__ Now supports prefixed (`http`/`https`) URIs.

* __Progress Indicators Support Cancellation:__ Progress indicators now actually support canceling during pipeline execution, script console execution, or build log downloads.

### Fixed

* __Snippets Refresh Fix__: When host information is changed, snippets will now update GDSL global shared library definitions correctly without a need for restarting the editor.

## 0.1.3

### Fixed
- Broken `.pipeline` command in `packages.json`
- Create job hang for Pipeline fixed; better error handling.

## 0.1.2

### Fixed

- Snippets configuration now work

## 0.1.1
- Initial release