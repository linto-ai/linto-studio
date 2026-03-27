#!/bin/bash

# Update version in studio-api, studio-frontend, and studio-websocket package.json files

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASE_FILE="$SCRIPT_DIR/RELEASE.md"

PACKAGES=(
    "studio-api"
    "studio-frontend"
    "studio-websocket"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

usage() {
    echo "Usage: $0 [OPTIONS] [VERSION]"
    echo ""
    echo "Options:"
    echo "  --major       Bump major version: update RELEASE.md + package.json"
    echo "  --minor       Bump minor version: update RELEASE.md + package.json"
    echo "  --patch       Bump patch version: update RELEASE.md + package.json"
    echo "  --tag         Create and push git tag for current version (run after commit)"
    echo "  --show        Display current versions and last release notes"
    echo "  --changelog   Show commits since last release date"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --patch            Bump patch (1.6.2 -> 1.6.3) + prepare release notes"
    echo "  $0 --minor            Bump minor (1.6.2 -> 1.7.0) + prepare release notes"
    echo "  $0 --major            Bump major (1.6.2 -> 2.0.0) + prepare release notes"
    echo "  $0 --tag              Create git tag v1.7.0 and push to remote"
    echo "  $0 1.7.0              Only update package.json to 1.7.0 (no RELEASE.md)"
    echo "  $0 --show             Show current versions and release notes"
    echo "  $0 --changelog        Show commits since last release"
}

# Get version from a package.json file
get_version() {
    local package_json="$1"
    if command -v jq &> /dev/null; then
        jq -r '.version' "$package_json"
    else
        grep '"version"' "$package_json" | sed 's/.*"version": "\([^"]*\)".*/\1/'
    fi
}

# Get the highest version among all packages
get_highest_version() {
    local highest=""
    for pkg in "${PACKAGES[@]}"; do
        local package_json="$SCRIPT_DIR/$pkg/package.json"
        if [ -f "$package_json" ]; then
            local ver=$(get_version "$package_json")
            if [ -z "$highest" ] || version_gt "$ver" "$highest"; then
                highest="$ver"
            fi
        fi
    done
    echo "$highest"
}

# Compare two versions: returns 0 if $1 > $2
version_gt() {
    local v1="$1"
    local v2="$2"

    # Remove any suffix for comparison
    local v1_base=$(echo "$v1" | sed 's/-.*//')
    local v2_base=$(echo "$v2" | sed 's/-.*//')

    local v1_major=$(echo "$v1_base" | cut -d. -f1)
    local v1_minor=$(echo "$v1_base" | cut -d. -f2)
    local v1_patch=$(echo "$v1_base" | cut -d. -f3)

    local v2_major=$(echo "$v2_base" | cut -d. -f1)
    local v2_minor=$(echo "$v2_base" | cut -d. -f2)
    local v2_patch=$(echo "$v2_base" | cut -d. -f3)

    if [ "$v1_major" -gt "$v2_major" ]; then return 0; fi
    if [ "$v1_major" -lt "$v2_major" ]; then return 1; fi
    if [ "$v1_minor" -gt "$v2_minor" ]; then return 0; fi
    if [ "$v1_minor" -lt "$v2_minor" ]; then return 1; fi
    if [ "$v1_patch" -gt "$v2_patch" ]; then return 0; fi
    return 1
}

# Bump version
bump_version() {
    local version="$1"
    local bump_type="$2"

    local base=$(echo "$version" | sed 's/-.*//')
    local major=$(echo "$base" | cut -d. -f1)
    local minor=$(echo "$base" | cut -d. -f2)
    local patch=$(echo "$base" | cut -d. -f3)

    case "$bump_type" in
        major)
            echo "$((major + 1)).0.0"
            ;;
        minor)
            echo "$major.$((minor + 1)).0"
            ;;
        patch)
            echo "$major.$minor.$((patch + 1))"
            ;;
    esac
}

# Get last release info from RELEASE.md
get_last_release_info() {
    if [ ! -f "$RELEASE_FILE" ]; then
        echo ""
        return
    fi

    # Extract the first date pattern _YYYY_MM_DD_ from RELEASE.md
    grep -m1 -oE '_[0-9]{4}_[0-9]{2}_[0-9]{2}_' "$RELEASE_FILE" | head -1
}

# Get last release version from RELEASE.md
get_last_release_version() {
    if [ ! -f "$RELEASE_FILE" ]; then
        echo ""
        return
    fi

    # Extract the first version header # X.Y.Z from RELEASE.md
    grep -m1 -oE '^# [0-9]+\.[0-9]+\.[0-9]+' "$RELEASE_FILE" | sed 's/# //'
}

# Get release notes for the last version from RELEASE.md
get_last_release_notes() {
    if [ ! -f "$RELEASE_FILE" ]; then
        echo ""
        return
    fi

    # Extract content between first and second version headers
    # Skip the version header, date line, and leading empty lines
    sed -n '2,/^# [0-9]/p' "$RELEASE_FILE" | \
        sed '/^# [0-9]/d' | \
        grep -v '^_[0-9]\{4\}_[0-9]\{2\}_[0-9]\{2\}_$' | \
        sed '/./,$!d'
}

# Convert _YYYY_MM_DD_ to YYYY-MM-DD
convert_date_format() {
    local date_str="$1"
    # Remove underscores and convert to YYYY-MM-DD
    echo "$date_str" | sed 's/_//g' | sed 's/\([0-9]\{4\}\)\([0-9]\{2\}\)\([0-9]\{2\}\)/\1-\2-\3/'
}

# Show current versions and last release notes
show_versions() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Current versions${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    for pkg in "${PACKAGES[@]}"; do
        local package_json="$SCRIPT_DIR/$pkg/package.json"
        if [ -f "$package_json" ]; then
            local ver=$(get_version "$package_json")
            echo -e "  $pkg: ${GREEN}$ver${NC}"
        else
            echo -e "  $pkg: ${RED}(not found)${NC}"
        fi
    done

    # Show last release notes
    local release_version=$(get_last_release_version)
    local release_date_raw=$(get_last_release_info)

    if [ -n "$release_version" ]; then
        local release_date=$(convert_date_format "$release_date_raw")
        echo ""
        echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
        echo -e "${YELLOW}  Last release notes: ${GREEN}$release_version${NC} ${CYAN}($release_date)${NC}"
        echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
        echo ""
        get_last_release_notes | while IFS= read -r line; do
            echo "  $line"
        done
    fi

    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Show changelog since last release
show_changelog() {
    local release_date_raw=$(get_last_release_info)
    local release_version=$(get_last_release_version)

    if [ -z "$release_date_raw" ]; then
        echo -e "${RED}Error: Could not find release date in $RELEASE_FILE${NC}"
        echo "Expected format: _YYYY_MM_DD_"
        exit 1
    fi

    local release_date=$(convert_date_format "$release_date_raw")
    local today=$(date +%Y-%m-%d)

    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Changelog since last release${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  Last release: ${GREEN}$release_version${NC} (${CYAN}$release_date${NC})"
    echo -e "  Today:        ${CYAN}$today${NC}"
    echo ""
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}  Commits since $release_date:${NC}"
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
    echo ""

    # Get commits since the release date
    local commit_count=$(git -C "$SCRIPT_DIR" log --since="$release_date" --oneline 2>/dev/null | wc -l)

    if [ "$commit_count" -eq 0 ]; then
        echo -e "  ${YELLOW}No commits since last release${NC}"
    else
        echo -e "  ${GREEN}$commit_count commit(s) found${NC}"
        echo ""

        # Show commits with formatting
        git -C "$SCRIPT_DIR" log --since="$release_date" \
            --pretty=format:"  %C(yellow)%h%C(reset) %C(cyan)%ad%C(reset) %s %C(dim)(%an)%C(reset)" \
            --date=short 2>/dev/null

    fi

    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Prepare release notes in RELEASE.md
prepare_release() {
    local version="$1"
    local release_date_raw=$(get_last_release_info)
    local today=$(date +%Y_%m_%d)
    local today_display=$(date +%Y-%m-%d)

    if [ -z "$release_date_raw" ]; then
        echo -e "${RED}Error: Could not find last release date in $RELEASE_FILE${NC}"
        exit 1
    fi

    local release_date=$(convert_date_format "$release_date_raw")

    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Preparing release ${GREEN}$version${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""

    # Get commits since last release
    local commits=$(git -C "$SCRIPT_DIR" log --since="$release_date" --pretty=format:"%s" 2>/dev/null)
    local commit_count=$(echo "$commits" | grep -c . || echo "0")

    if [ "$commit_count" -eq 0 ]; then
        echo -e "${YELLOW}Warning: No commits found since last release${NC}"
        commits="- No changes recorded"
    fi

    echo -e "  Date: ${CYAN}$today_display${NC}"
    echo -e "  Commits to include: ${GREEN}$commit_count${NC}"
    echo ""

    # Build the new release section
    local new_section="# $version

_${today}_

"

    # Add commits as bullet points
    while IFS= read -r commit_msg; do
        if [ -n "$commit_msg" ]; then
            new_section+="- $commit_msg
"
        fi
    done <<< "$commits"

    new_section+="
"

    # Prepend to RELEASE.md
    if [ -f "$RELEASE_FILE" ]; then
        local existing_content=$(cat "$RELEASE_FILE")
        echo -e "$new_section$existing_content" > "$RELEASE_FILE"
    else
        echo -e "$new_section" > "$RELEASE_FILE"
    fi

    echo -e "${GREEN}Updated $RELEASE_FILE with new version $version${NC}"
    echo ""
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}  Draft release notes added:${NC}"
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
    echo ""

    # Show what was added
    while IFS= read -r commit_msg; do
        if [ -n "$commit_msg" ]; then
            echo -e "  - $commit_msg"
        fi
    done <<< "$commits"

    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Prompt user for confirmation
confirm_action() {
    local message="$1"
    echo -e "${YELLOW}$message${NC}"
    echo -n -e "Continue? [y/N] "
    read -r response
    case "$response" in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            echo -e "${RED}Aborted${NC}"
            return 1
            ;;
    esac
}

# Create and push git tag for current version
create_tag() {
    local version=$(get_last_release_version)

    if [ -z "$version" ]; then
        echo -e "${RED}Error: Could not find version in $RELEASE_FILE${NC}"
        exit 1
    fi

    local tag_name="v$version"

    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Creating git tag${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""

    # Check if tag already exists
    if git -C "$SCRIPT_DIR" tag -l "$tag_name" | grep -q "$tag_name"; then
        echo -e "${YELLOW}Tag $tag_name already exists${NC}"
        echo ""
        echo -e "To delete and recreate:"
        echo -e "  git tag -d $tag_name"
        echo -e "  git push origin :refs/tags/$tag_name"
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        exit 1
    fi

    # Check for uncommitted changes
    if ! git -C "$SCRIPT_DIR" diff-index --quiet HEAD -- 2>/dev/null; then
        echo -e "${RED}Error: You have uncommitted changes${NC}"
        echo -e "Please commit your changes before creating a tag"
        echo ""
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        exit 1
    fi

    # Get release notes for tag message
    local release_notes=$(get_last_release_notes)

    # Get current commit info
    local commit_hash=$(git -C "$SCRIPT_DIR" rev-parse --short HEAD)
    local commit_msg=$(git -C "$SCRIPT_DIR" log -1 --pretty=format:"%s")
    local remote_url=$(git -C "$SCRIPT_DIR" remote get-url origin 2>/dev/null || echo "origin")

    echo -e "  Version:    ${GREEN}$version${NC}"
    echo -e "  Tag:        ${CYAN}$tag_name${NC}"
    echo -e "  Commit:     ${YELLOW}$commit_hash${NC} - $commit_msg"
    echo -e "  Remote:     $remote_url"
    echo ""
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}  Tag message:${NC}"
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "  Release $version"
    echo ""
    echo "$release_notes" | while IFS= read -r line; do
        echo "  $line"
    done
    echo ""
    echo -e "${BLUE}───────────────────────────────────────────────────────────────${NC}"
    echo ""

    # Ask for confirmation
    if ! confirm_action "This will create tag '$tag_name' and push it to origin."; then
        echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
        exit 0
    fi

    echo ""

    # Create annotated tag with release notes as message
    echo -e "${YELLOW}Creating tag...${NC}"
    git -C "$SCRIPT_DIR" tag -a "$tag_name" -m "Release $version" -m "$release_notes"
    echo -e "${GREEN}Tag $tag_name created${NC}"
    echo ""

    # Push tag to remote
    echo -e "${YELLOW}Pushing tag to origin...${NC}"
    git -C "$SCRIPT_DIR" push origin "$tag_name"
    echo -e "${GREEN}Tag $tag_name pushed to origin${NC}"

    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}Done! Tag $tag_name is now available on GitHub${NC}"
}

# Parse arguments
SHOW_ONLY=false
SHOW_CHANGELOG=false
CREATE_TAG=false
BUMP_TYPE=""
VERSION=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --major)
            BUMP_TYPE="major"
            shift
            ;;
        --minor)
            BUMP_TYPE="minor"
            shift
            ;;
        --patch)
            BUMP_TYPE="patch"
            shift
            ;;
        --tag)
            CREATE_TAG=true
            shift
            ;;
        --show)
            SHOW_ONLY=true
            shift
            ;;
        --changelog)
            SHOW_CHANGELOG=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        -*)
            echo "Error: Unknown option $1"
            usage
            exit 1
            ;;
        *)
            VERSION="$1"
            shift
            ;;
    esac
done

# Handle --show flag
if [ "$SHOW_ONLY" = true ]; then
    show_versions
    exit 0
fi

# Handle --changelog flag
if [ "$SHOW_CHANGELOG" = true ]; then
    show_changelog
    exit 0
fi

# Handle --tag flag
if [ "$CREATE_TAG" = true ]; then
    create_tag
    exit 0
fi

# Determine version to use
if [ -n "$BUMP_TYPE" ]; then
    if [ -n "$VERSION" ]; then
        echo "Error: Cannot specify both --$BUMP_TYPE and a version number"
        exit 1
    fi
    CURRENT_HIGHEST=$(get_highest_version)
    VERSION=$(bump_version "$CURRENT_HIGHEST" "$BUMP_TYPE")

    # When using bump type, always prepare release notes first
    prepare_release "$VERSION"
    echo ""
elif [ -z "$VERSION" ]; then
    usage
    exit 1
fi

# Validate version format (basic semver check)
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$ ]]; then
    echo -e "${RED}Error: Invalid version format. Expected format: X.Y.Z or X.Y.Z-suffix${NC}"
    exit 1
fi

# Validate that new version is greater than current versions
echo ""
echo "Validating version..."
VALIDATION_FAILED=false
for pkg in "${PACKAGES[@]}"; do
    package_json="$SCRIPT_DIR/$pkg/package.json"
    if [ -f "$package_json" ]; then
        current_ver=$(get_version "$package_json")
        if ! version_gt "$VERSION" "$current_ver" && [ "$VERSION" != "$current_ver" ]; then
            echo -e "${RED}Error: New version $VERSION is not greater than current version $current_ver in $pkg${NC}"
            VALIDATION_FAILED=true
        fi
    fi
done

if [ "$VALIDATION_FAILED" = true ]; then
    echo ""
    echo -e "${YELLOW}Hint: Use --show to see current versions${NC}"
    exit 1
fi

echo -e "${GREEN}Version $VERSION is valid (greater than all current versions)${NC}"
echo ""

# Apply version update
echo "Updating version to $VERSION..."

for pkg in "${PACKAGES[@]}"; do
    PACKAGE_JSON="$SCRIPT_DIR/$pkg/package.json"

    if [ ! -f "$PACKAGE_JSON" ]; then
        echo -e "${YELLOW}Warning: $PACKAGE_JSON not found, skipping${NC}"
        continue
    fi

    current_ver=$(get_version "$PACKAGE_JSON")

    # Update version using jq if available, otherwise use sed
    if command -v jq &> /dev/null; then
        tmp=$(mktemp)
        jq --arg v "$VERSION" '.version = $v' "$PACKAGE_JSON" > "$tmp" && mv "$tmp" "$PACKAGE_JSON"
    else
        sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$PACKAGE_JSON"
    fi

    echo -e "${GREEN}Updated $pkg/package.json: $current_ver -> $VERSION${NC}"
done

echo ""
echo -e "${GREEN}Done!${NC}"
