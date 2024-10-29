<script lang="ts">
  import * as key from '$lib/keymap';
</script>

<div class="table-container w-full shadow-xl">
  <table class="table table-compact table-hover">
    <thead>
      <tr>
        <td colspan="2">Keyboard shortcuts</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>New Script:</td>
        <td>alt+{key.keyNewDoc} / ctrl+{key.keyNewDoc}</td>
      </tr>
      <tr>
        <td>Save Script:</td>
        <td>alt+{key.keySaveDoc}</td>
      </tr>
      <tr>
        <td>Save New Script Version:</td>
        <td>alt+{key.keySaveDocNewVersion}</td>
      </tr>
      <tr>
        <td>Rename Script:</td>
        <td>alt+{key.keyRenameDoc}</td>
      </tr>
      <tr>
        <td>Open Achive (save/load):</td>
        <td>alt+{key.keyArchive}</td>
      </tr>
      <tr>
        <td>Build (without saving):</td>
        <td>alt+{key.keyBuild}</td>
      </tr>
      <tr>
        <td>View Split:</td>
        <td>alt+{key.keyViewSplit}</td>
      </tr>
      <tr>
        <td>View Code:</td>
        <td>alt+{key.keyViewCode}</td>
      </tr>
      <tr>
        <td>View Canvas:</td>
        <td>alt+{key.keyViewCanvas}</td>
      </tr>
      <tr>
        <td>View Controls:</td>
        <td>alt+{key.keyViewControls}</td>
      </tr>
    </tbody>
  </table>
</div>