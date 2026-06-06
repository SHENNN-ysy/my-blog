#!/bin/bash
set -e

# Read the private key
PRIVATE_KEY=$(cat ~/.ssh/id_ed25519_github)

# Escape for XML (replace &, <, >, ", ' for XML content)
ESCAPED_KEY=$(printf '%s' "$PRIVATE_KEY" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')

# Write credentials.xml
docker exec -u root jenkins bash -c "cat > /var/jenkins_home/credentials.xml << 'ENDXML'
<?xml version=\"1.1\" encoding=\"UTF-8\"?>
<credentials>
  <com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey plugin=\"ssh-slaves@657.v85a_b_2a_4793a_2\">
    <id>github-ssh-key</id>
    <username>git</username>
    <description>GitHub SSH Key</description>
    <privateKeySource class=\"com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey\\\$DirectEntryPrivateKeySource\">
      <privateKey>${ESCAPED_KEY}</privateKey>
    </privateKeySource>
  </com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey>
</credentials>
ENDXML"

echo "credentials.xml written successfully"
docker exec jenkins cat /var/jenkins_home/credentials.xml | head -5
