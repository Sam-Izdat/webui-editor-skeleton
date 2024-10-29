<script lang="ts">
  import * as key from '$lib/keymap';
</script>

<div class="table-container w-full shadow-xl">
  <table class="table table-compact table-hover">
    <thead>
      <tr>
        <td>Keyboard shortcut</td>
        <td>Key</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>New Script:</td>
        <td>{key.keySaveDoc}</td>
      </tr>
      <tr>
        <td>Save Script:</td>
        <td>{key.keySaveDoc}</td>
      </tr>
      <tr>
        <td>Save New Script Version:</td>
        <td>{key.keySaveDocNewVersion}</td>
      </tr>
      <tr>
        <td>Rename Script:</td>
        <td>{key.keyRenameDoc}</td>
      </tr>
      <tr>
        <td>Open Achive (save/load):</td>
        <td>{key.keyArchive}</td>
      </tr>
      <tr>
        <td>Build (without saving):</td>
        <td>{key.keyBuild}</td>
      </tr>
      <tr>
        <td>View Split:</td>
        <td>{key.keyViewSplit}</td>
      </tr>
      <tr>
        <td>View Code:</td>
        <td>{key.keyViewCode}</td>
      </tr>
      <tr>
        <td>View Canvas:</td>
        <td>{key.keyViewCanvas}</td>
      </tr>
      <tr>
        <td>View Controls:</td>
        <td>{key.keyViewControls}</td>
      </tr>
    </tbody>
  </table>
</div>