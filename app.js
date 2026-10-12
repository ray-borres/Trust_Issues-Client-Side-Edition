(() => {
    "use strict";
    const output = document.getElementById("output");
    const status = document.getElementById("status");
    const telemetry = [14, 77, 5, 84, 17, 30, 65, 21, 87, 6, 31, 119, 51, 119, 24, 9, 65, 6, 93, 60, 21, 91, 21, 110, 15, 12, 77];

    const defaults = {
        role: "operator"
    };

    function merge(target, source) {
        for (const key in source) {
            const value = source[key];
            if (value && typeof value === "object") {
                if (!target[key] || typeof target[key] !== "object") target[key] = {};
                merge(target[key], value);
            } else {
                target[key] = value;
            }
        }
        return target;
    }

    function renderDiagnostic(config) {
        output.innerHTML = config.template || "Access denied. Diagnostics require elevated privileges.";
    }

    document.getElementById("loginBtn").addEventListener("click", () => {
        const alias = document.getElementById("operator").value.trim();
        const pass = document.getElementById("passcode").value;
        if (alias === "operator" && pass === "local-only") {
            status.style.color = "var(--cyan)";
            status.textContent = "Authenticated. Diagnostics available.";
            renderDiagnostic(defaults);
        } else {
            status.style.color = "var(--red)";
            status.textContent = "Rejected. Legacy diagnostics still initialize in the background.";
        }
    });

    window.__NODE09__ = {
        merge,
        defaults,
        renderDiagnostic,
        telemetry,
        xorDecode(bytes, key) {
            return bytes.map((n, i) => String.fromCharCode(n ^ key.charCodeAt(i % key.length))).join("");
        },
        getTelemetry() { return this.xorDecode(telemetry, "m4g1c"); }
    };

    window.__NODE09__.importProfile = function(jsonText) {
        const profile = JSON.parse(jsonText);
        merge({}, profile);
        renderDiagnostic(defaults);
    };
})();