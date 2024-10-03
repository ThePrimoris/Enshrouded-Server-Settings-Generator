document.addEventListener("DOMContentLoaded", function () {
    const userGroupsContainer = document.querySelector(".user-groups-container");
    const addGroupButton = document.querySelector("#addGroupButton");
    const generateJsonButton = document.getElementById('generateJsonButton');
    const jsonModal = document.getElementById('jsonModal');
    const jsonPreview = document.getElementById('jsonPreview');
    const closeModal = document.querySelector('.close');
    const copyJsonButton = document.getElementById('copyJsonButton');
    const downloadJsonButton = document.getElementById('downloadJsonButton');

    const defaultGroups = [
        { name: "Admin", password: "Admin123", canKickBan: true, canAccessInventories: true, canEditBase: true, canExtendBase: true, reservedSlots: 0 },
        { name: "Friend", password: "Friend123", canKickBan: false, canAccessInventories: true, canEditBase: false, canExtendBase: false, reservedSlots: 0 },
        { name: "Guest", password: "Guest123", canKickBan: false, canAccessInventories: false, canEditBase: false, canExtendBase: false, reservedSlots: 0 },
    ];

    // Function to generate a group
    function generateGroup(groupData = {}) {
        const groupContainer = document.createElement("div");
        groupContainer.classList.add("user-group-container");

        groupContainer.innerHTML = `
            <div class="user-group-grid">
                <div class="input-group">
                    <label>Name</label>
                    <p class="description">Group Name</p>
                    <input type="text" placeholder="Group Name" value="${groupData.name || ''}">
                </div>
                <div class="input-group">
                    <label>Password</label>
                    <p class="description">Password for the group, it must be distinct from other groups.</p>
                    <input type="text" placeholder="Password" value="${groupData.password || ''}">
                </div>
            </div>

            <div class="user-group-grid">
                <div class="input-group">
                    <label>Reserved Slots</label>
                    <p class="description">When 1 or more reserved slots are set, the lobby will be marked as “full” for players who try to log into the server under a different user group and would fill up all session slots.</p> <br>
                    <input type="number" placeholder="0" value="${groupData.reservedSlots || 0}" min="0">
                </div>
                <div class="input-group">
                    <div class="checkbox-group-grid">
                        <div>
                            <label>Can Kick/Ban</label> <br> <br>
                            <label class="toggle-container">
                                <input type="checkbox" ${groupData.canKickBan ? 'checked' : ''} data-type="kick-ban">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div>
                            <label>Can Access Inventories</label> <br> <br>
                            <label class="toggle-container">
                                <input type="checkbox" ${groupData.canAccessInventories ? 'checked' : ''} data-type="access-inventories">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div>
                            <label>Can Edit Base</label> <br> <br>
                            <label class="toggle-container">
                                <input type="checkbox" ${groupData.canEditBase ? 'checked' : ''} data-type="edit-base">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div>
                            <label>Can Extend Base</label> <br> <br>
                            <label class="toggle-container">
                                <input type="checkbox" ${groupData.canExtendBase ? 'checked' : ''} data-type="extend-base">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;

        userGroupsContainer.appendChild(groupContainer);
    }

    // Generate default groups
    defaultGroups.forEach(group => generateGroup(group));

    // Event listener to add a new group
    addGroupButton.addEventListener("click", () => {
        generateGroup();
    });

    // Gather user group data from the form dynamically
    function gatherUserGroupsData() {
        const userGroups = [];
        document.querySelectorAll('.user-group-container').forEach(groupContainer => {
            const groupName = groupContainer.querySelector('input[placeholder="Group Name"]').value;
            const groupPassword = groupContainer.querySelector('input[placeholder="Password"]').value;
            const reservedSlots = groupContainer.querySelector('input[type="number"]').value;
            const canKickBan = groupContainer.querySelector('input[type="checkbox"][data-type="kick-ban"]').checked;
            const canAccessInventories = groupContainer.querySelector('input[type="checkbox"][data-type="access-inventories"]').checked;
            const canEditBase = groupContainer.querySelector('input[type="checkbox"][data-type="edit-base"]').checked;
            const canExtendBase = groupContainer.querySelector('input[type="checkbox"][data-type="extend-base"]').checked;

            userGroups.push({
                name: groupName,
                password: groupPassword,
                canKickBan,
                canAccessInventories,
                canEditBase,
                canExtendBase,
                reservedSlots: parseInt(reservedSlots)
            });
        });
        return userGroups;
    }

// Gather server settings dynamically from inputs
function gatherServerSettings() {
    return {
        name: document.querySelector('input#name').value || "Enshrouded Server",
        saveDirectory: document.querySelector('input#saveDirectory').value || "./savegame",
        logDirectory: document.querySelector('input#logDirectory').value || "./logs",
        ip: document.querySelector('input#ip').value || "0.0.0.0",
        queryPort: parseInt(document.querySelector('input#queryPort').value) || 15637,
        slotCount: parseInt(document.querySelector('select#slotCount').value) || 16,
        gameSettingsPreset: document.querySelector('select#gameSettingsPreset').value || "Default",
        gameSettings: {
            playerHealthFactor: parseFloat(document.querySelector('input#playerHealthFactor').value) || 1,
            playerManaFactor: parseFloat(document.querySelector('input#playerManaFactor').value) || 1,
            playerStaminaFactor: parseFloat(document.querySelector('input#playerStaminaFactor').value) || 1,
            enableDurability: document.querySelector('input#enableDurability').checked,
            enableStarvingDebuff: document.querySelector('input#enableStarvingDebuff').checked,
            tombstoneMode: document.querySelector('select#tombstoneMode').value || "AddBackpackMaterials",
            foodBuffDurationFactor: parseFloat(document.querySelector('input#foodBuffDurationFactor').value) || 1,
            fromHungerToStarving: parseFloat(document.querySelector('input#fromHungerToStarving').value) || 600000000000,
            shroudTimeFactor: parseFloat(document.querySelector('input#shroudTimeFactor').value) || 1,
            miningDamageFactor: parseFloat(document.querySelector('input#miningDamageFactor').value) || 1,
            plantGrowthSpeedFactor: parseFloat(document.querySelector('input#plantGrowthSpeedFactor').value) || 1,
            resourceDropStackAmountFactor: parseFloat(document.querySelector('input#resourceDropStackAmountFactor').value) || 1,
            factoryProductionSpeedFactor: parseFloat(document.querySelector('input#factoryProductionSpeedFactor').value) || 1,
            perkUpgradeRecyclingFactor: parseFloat(document.querySelector('input#perkUpgradeRecyclingFactor').value) || 0.5,
            perkCostFactor: parseFloat(document.querySelector('input#perkCostFactor').value) || 1,
            experienceCombatFactor: parseFloat(document.querySelector('input#experienceCombatFactor').value) || 1,
            experienceMiningFactor: parseFloat(document.querySelector('input#experienceMiningFactor').value) || 1,
            experienceExplorationQuestsFactor: parseFloat(document.querySelector('input#experienceExplorationQuestsFactor').value) || 1,
            randomSpawnerAmount: document.querySelector('select#randomSpawnerAmount').value || "Normal",
            aggroPoolAmount: document.querySelector('select#aggroPoolAmount').value || "Normal",
            enemyDamageFactor: parseFloat(document.querySelector('input#enemyDamageFactor').value) || 1,
            enemyHealthFactor: parseFloat(document.querySelector('input#enemyHealthFactor').value) || 1,
            enemyStaminaFactor: parseFloat(document.querySelector('input#enemyStaminaFactor').value) || 1,
            enemyPerceptionRangeFactor: parseFloat(document.querySelector('input#enemyPerceptionRangeFactor').value) || 1,
            bossDamageFactor: parseFloat(document.querySelector('input#bossDamageFactor').value) || 1,
            bossHealthFactor: parseFloat(document.querySelector('input#bossHealthFactor').value) || 1,
            threatBonus: parseFloat(document.querySelector('input#threatBonus').value) || 1,
            pacifyAllEnemies: document.querySelector('input#pacifyAllEnemies').checked,
            dayTimeDuration: parseFloat(document.querySelector('input#dayTimeDuration').value) || 1800000000000,
            nightTimeDuration: parseFloat(document.querySelector('input#nightTimeDuration').value) || 720000000000
        },
        userGroups: gatherUserGroupsData() // Assuming you have this function defined correctly
    };
}

    
    // Generate the JSON on button click
    generateJsonButton.addEventListener('click', function () {
        const serverSettings = gatherServerSettings();

        // Show JSON in the modal
        jsonPreview.value = JSON.stringify(serverSettings, null, 4);
        jsonModal.style.display = "flex";
    });

    // Close the modal
    closeModal.addEventListener('click', function () {
        jsonModal.style.display = "none";
    });

    // Copy JSON to clipboard
    copyJsonButton.addEventListener('click', function () {
        jsonPreview.select();
        document.execCommand("copy");
        alert("JSON copied to clipboard!");
    });

    // Download JSON as file
    downloadJsonButton.addEventListener('click', function () {
        const blob = new Blob([jsonPreview.value], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "enshrouded_server.json";
        a.click();
        URL.revokeObjectURL(url);
    });
});
